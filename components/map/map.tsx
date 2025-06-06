import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { useRouter } from "next/router";
import MapGl, {
  Source,
  Layer,
  ViewState,
  SourceProps,
  LayerProps,
  LngLatBoundsLike,
} from "react-map-gl/maplibre";
import { Pane, Alert } from "evergreen-ui";

import MapContext, { SOURCE_TILE_ID } from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import TokenContext from "@/contexts/token";
import DrawContext from "@/contexts/draw";
import ParcellesContext from "@/contexts/parcelles";
import BalDataContext from "@/contexts/bal-data";

import { cadastreLayers } from "@/components/map/layers/cadastre";
import {
  tilesLayers,
  VOIE_LABEL,
  VOIE_TRACE_LINE,
  NUMEROS_POINT,
  NUMEROS_LABEL,
  LAYERS_SOURCE,
} from "@/components/map/layers/tiles";
import { vector, ortho, planIGN } from "@/components/map/styles";
import EditableMarker from "@/components/map/editable-marker";
import NumerosMarkers from "@/components/map/numeros-markers";
import ToponymeMarker from "@/components/map/toponyme-marker";
import MapMarker from "@/components/map/map-marker";
import PopupFeature from "@/components/map/popup-feature/popup-feature";
import NavControl from "@/components/map/controls/nav-control";
import DrawControl from "./controls/draw-control";
import StyleControl from "@/components/map/controls/style-control";
import AddressEditorControl from "@/components/map/controls/address-editor-control";
import ImageControl from "@/components/map/controls/image-control";
import useBounds from "@/components/map/hooks/bounds";
import useHovered from "@/components/map/hooks/hovered";
import { ExtendedBaseLocaleDTO, Numero } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";
import { TabsEnum } from "../sidebar/main-tabs/main-tabs";

const TOPONYMES_MIN_ZOOM = 13;

const LAYERS = [...cadastreLayers];

const settings = {
  maxZoom: 19,
};

const interactionProps = {
  dragPan: true,
  dragRotate: true,
  scrollZoom: true,
  touchZoom: true,
  touchRotate: true,
  keyboard: true,
  doubleClickZoom: true,
};

function getBaseStyle(style) {
  switch (style) {
    case "ortho":
      return ortho;

    case "vector":
      return vector;

    case "plan-ign":
      return planIGN;
    default:
      return vector;
  }
}

function generateNewStyle(style) {
  const baseStyle = getBaseStyle(style);
  return baseStyle.updateIn(["layers"], (arr: any[]) => arr.push(...LAYERS));
}

export interface MapProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
  isAddressFormOpen: boolean;
  handleAddressForm: (open: boolean) => void;
}

function Map({
  commune,
  baseLocale,
  isAddressFormOpen,
  handleAddressForm,
}: MapProps) {
  const router = useRouter();
  const {
    map,
    isTileSourceLoaded,
    handleMapRef,
    style,
    setStyle,
    defaultStyle,
    isStyleLoaded,
    viewport,
    setViewport,
    isCadastreDisplayed,
    setIsCadastreDisplayed,
    balTilesUrl,
    isMapLoaded,
    showToponymes,
  } = useContext(MapContext);
  const { isParcelleSelectionEnabled, handleParcelles } =
    useContext(ParcellesContext);
  const { isMobile } = useContext(LayoutContext);

  const [cursor, setCursor] = useState("default");
  const [isContextMenuDisplayed, setIsContextMenuDisplayed] = useState(null);
  const [mapStyle, setMapStyle] = useState(generateNewStyle(defaultStyle));

  const { balId } = router.query;
  const {
    voie,
    toponyme,
    numeros,
    toponymes,
    editingId,
    setEditingId,
    isEditing,
  } = useContext(BalDataContext);
  const { modeId, hint, drawEnabled } = useContext(DrawContext);
  const { token } = useContext(TokenContext);

  const communeHasOrtho = useMemo(() => commune.hasOrtho, [commune]);

  const [handleHover, handleMouseLeave, featureHovered] = useHovered(map);
  const bounds = useBounds(map, router, commune, voie, toponyme);

  const prevStyle = useRef(defaultStyle);

  const updatePositionsLayer = useCallback(() => {
    if (map && isTileSourceLoaded) {
      // Filter positions of voie or toponyme
      if (voie) {
        if (drawEnabled && modeId !== "drawPolygon") {
          map.setFilter(VOIE_TRACE_LINE, ["!=", ["get", "id"], voie.id]);
        } else {
          map.setFilter(VOIE_TRACE_LINE, null);
        }

        map.setFilter(NUMEROS_POINT, ["!=", ["get", "idVoie"], voie.id]);
        map.setFilter(NUMEROS_LABEL, ["!=", ["get", "idVoie"], voie.id]);
        map.setFilter(VOIE_LABEL, ["!=", ["get", "id"], voie.id]);
      } else if (toponyme) {
        map.setFilter(NUMEROS_POINT, [
          "!=",
          ["get", "idToponyme"],
          toponyme.id,
        ]);
        map.setFilter(NUMEROS_LABEL, [
          "!=",
          ["get", "idToponyme"],
          toponyme.id,
        ]);
      } else {
        // Remove filter
        map.setFilter(VOIE_TRACE_LINE, null);
        map.setFilter(NUMEROS_POINT, null);
        map.setFilter(NUMEROS_LABEL, null);
        map.setFilter(VOIE_LABEL, null);
      }
    }
  }, [map, voie, toponyme, isTileSourceLoaded, drawEnabled]);

  const interactiveLayerIds = useMemo(() => {
    const layers = [];

    if (isParcelleSelectionEnabled && isCadastreDisplayed) {
      return ["parcelles-fill"];
    }

    if (!isEditing && isTileSourceLoaded) {
      layers.push(VOIE_TRACE_LINE, NUMEROS_POINT, NUMEROS_LABEL, VOIE_LABEL);
    }

    return layers;
  }, [
    isEditing,
    isParcelleSelectionEnabled,
    isCadastreDisplayed,
    isTileSourceLoaded,
  ]);

  const onClick = useCallback(
    (event) => {
      const features = map
        .queryRenderedFeatures(event.point)
        .filter(({ source, sourceLayer }) => {
          return (
            source === "cadastre" ||
            sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS ||
            sourceLayer === LAYERS_SOURCE.VOIES_POINTS ||
            sourceLayer === LAYERS_SOURCE.VOIES_LINES_STRINGS
          );
        });
      const feature = features && features[0];

      const parcelles = features.filter(
        ({ source, sourceLayer, layer }) =>
          source === "cadastre" &&
          sourceLayer === "parcelles" &&
          layer?.id === "parcelles-fill"
      );

      if (parcelles.length > 0) {
        handleParcelles(parcelles.map(({ properties }) => properties.id));
      } else if (
        feature &&
        !isEditing &&
        ((feature.sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS &&
          feature.properties.idVoie) ||
          ((feature.sourceLayer === LAYERS_SOURCE.VOIES_POINTS ||
            feature.sourceLayer === LAYERS_SOURCE.VOIES_LINES_STRINGS) &&
            feature.properties.id))
      ) {
        const idVoie =
          feature.sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS
            ? feature.properties.idVoie
            : feature.properties.id;
        router.push(`/bal/${balId}/${TabsEnum.VOIES}/${idVoie}/numeros`);
      }

      setIsContextMenuDisplayed(null);
    },
    [router, balId, setEditingId, isEditing, voie, handleParcelles]
  );

  useEffect(() => {
    if (modeId === "drawLineString") {
      setCursor("crosshair");
    } else if (featureHovered) {
      setCursor("pointer");
    } else {
      setCursor("default");
    }
  }, [modeId, featureHovered]);

  // Hide current voie's or toponyme's numeros
  useEffect(() => {
    updatePositionsLayer();
  }, [map, voie, toponyme, updatePositionsLayer]);

  // Change map's style and adapte layers
  useEffect(() => {
    if (map) {
      setMapStyle(generateNewStyle(style));

      if (isTileSourceLoaded) {
        // Adapt layer paint property to map style
        const isOrtho = style === "ortho";

        if (map.getLayer(VOIE_LABEL)) {
          map.setPaintProperty(
            VOIE_LABEL,
            "text-halo-color",
            isOrtho ? "#ffffff" : "#f8f4f0"
          );
        }

        if (map.getLayer(NUMEROS_POINT)) {
          map.setPaintProperty(
            NUMEROS_POINT,
            "circle-stroke-color",
            isOrtho ? "#ffffff" : "#f8f4f0"
          );
        }
      }
    }
  }, [map, style]);

  // Auto switch to ortho on draw and save previous style
  useEffect(() => {
    setStyle((style: string) => {
      if (drawEnabled && communeHasOrtho) {
        prevStyle.current = style;
        return "ortho";
      }

      return prevStyle.current;
    });
  }, [drawEnabled, setStyle, communeHasOrtho]);

  useEffect(() => {
    if (isStyleLoaded) {
      updatePositionsLayer();
    }
  }, [isStyleLoaded, updatePositionsLayer]);

  useEffect(() => {
    if (map && bounds) {
      const camera = map.cameraForBounds(bounds as LngLatBoundsLike, {
        padding: 100,
      });

      const hash = router.asPath.split("#")?.[1];
      if (hash) {
        const [zoom, latitude, longitude]: String[] = hash.split("/");
        setViewport((viewport: ViewState) => ({
          ...viewport,
          longitude: Number(longitude),
          latitude: Number(latitude),
          zoom: Number(zoom),
        }));
      } else if (camera) {
        setViewport((viewport: ViewState) => ({
          ...viewport,
          bearing: camera.bearing,
          longitude: (camera.center as any).lng,
          latitude: (camera.center as any).lat,
          zoom: camera.zoom,
        }));
      }
    }
  }, [map, bounds, setViewport]);

  const sourceTiles: SourceProps = useMemo(() => {
    return {
      id: SOURCE_TILE_ID,
      type: "vector",
      tiles: [balTilesUrl],
      promoteId: "id",
    };
  }, [balTilesUrl]);

  const layerCommune: LayerProps = useMemo(() => {
    return {
      id: "communes-fill",
      source: "decoupage-administratif",
      "source-layer": "communes",
      minzoom: 2,
      type: "fill",
      paint: {
        "fill-color": "#3288bd",
        "fill-opacity": [
          "interpolate",
          ["exponential", 0.5],
          ["zoom"],
          13,
          0.8,
          14,
          0,
        ],
      },
      filter: ["==", ["get", "code"], commune.code],
    };
  }, [commune]);

  const selectedVoieColor = useMemo(() => {
    if (!voie || !isMapLoaded) {
      return;
    }

    const featuresList = map?.querySourceFeatures(SOURCE_TILE_ID, {
      sourceLayer: LAYERS_SOURCE.VOIES_POINTS,
    });

    return featuresList?.find((feature) => feature.id === voie.id)?.properties
      .color;
  }, [map, voie, isMapLoaded]);

  const { markers } = useContext(MarkersContext);

  return (
    <Pane display="flex" flexDirection="column" flex={1}>
      <StyleControl
        style={style}
        handleStyle={setStyle}
        commune={commune}
        isCadastreDisplayed={isCadastreDisplayed}
        handleCadastre={setIsCadastreDisplayed}
      />
      {map && <DrawControl map={map} isMapLoaded={isMapLoaded} />}

      {token && !isMobile && (
        <Pane position="absolute" zIndex={1} top={90} right={10}>
          <AddressEditorControl
            isAddressFormOpen={isAddressFormOpen}
            handleAddressForm={handleAddressForm}
            isDisabled={isEditing && !isAddressFormOpen}
          />
        </Pane>
      )}

      {!isMobile && (
        <Pane position="absolute" zIndex={1} top={125} right={10}>
          <ImageControl map={map} communeNom={commune.nom} />
        </Pane>
      )}

      {hint && (
        <Pane
          zIndex={1}
          position="fixed"
          alignSelf="center"
          top={130}
          maxWidth="50%"
        >
          <Alert title={hint} />
        </Pane>
      )}

      <Pane display="flex" flex={1}>
        <MapGl
          ref={handleMapRef}
          hash={true}
          {...viewport}
          mapStyle={mapStyle as any}
          styleDiffing={false}
          {...settings}
          {...interactionProps}
          interactiveLayerIds={interactiveLayerIds}
          cursor={cursor}
          onClick={onClick}
          onMove={({ viewState }) => setViewport(viewState)}
          onTouchEnd={onClick}
          onMouseMove={handleHover}
          onMouseLeave={handleMouseLeave}
          onMouseOut={handleMouseLeave}
          dragRotate={false}
        >
          <NavControl />

          <Layer {...(layerCommune as LayerProps)} />

          <Source {...sourceTiles}>
            {Object.values(tilesLayers).map((layer) => (
              <Layer key={layer.id} {...(layer as LayerProps)} />
            ))}
          </Source>

          {(voie || toponyme) && !modeId && numeros && (
            <NumerosMarkers
              numeros={numeros.filter(({ id }) => id !== editingId) as Numero[]}
              isContextMenuDisplayed={isContextMenuDisplayed}
              setIsContextMenuDisplayed={setIsContextMenuDisplayed}
              color={selectedVoieColor}
            />
          )}

          {toponymes &&
            showToponymes &&
            viewport.zoom > TOPONYMES_MIN_ZOOM &&
            toponymes.map((toponyme) => (
              <ToponymeMarker
                key={toponyme.id}
                initialToponyme={toponyme}
                isContextMenuDisplayed={toponyme.id === isContextMenuDisplayed}
                setIsContextMenuDisplayed={setIsContextMenuDisplayed}
              />
            ))}

          {isEditing && (
            <EditableMarker
              style={style || defaultStyle}
              idVoie={voie?.id}
              isToponyme={Boolean(toponyme)}
              viewport={viewport}
            />
          )}

          {markers
            .filter((marker) => marker.isMapMarker)
            .map((marker) => (
              <MapMarker key={marker.id} marker={marker} />
            ))}

          {featureHovered !== null &&
            viewport.zoom > 14 &&
            (featureHovered.sourceLayer === LAYERS_SOURCE.VOIES_POINTS ||
              featureHovered.sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS) && (
              <PopupFeature feature={featureHovered} commune={commune} />
            )}
        </MapGl>
      </Pane>
    </Pane>
  );
}

export default Map;
