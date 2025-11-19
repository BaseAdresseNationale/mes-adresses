import { useState, useMemo, useEffect, useCallback, useContext } from "react";
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

import MapContext, { MapStyle, SOURCE_TILE_ID } from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import TokenContext from "@/contexts/token";
import DrawContext, { DrawMode } from "@/contexts/draw";
import ParcellesContext from "@/contexts/parcelles";
import BalDataContext from "@/contexts/bal-data";

import {
  getTilesLayers,
  VOIE_LABEL,
  VOIE_TRACE_LINE,
  NUMEROS_POINT,
  NUMEROS_LABEL,
  LAYERS_SOURCE,
  TOPONYME_LABEL,
  TilesLayerMode,
  ZOOM,
} from "@/components/map/layers/tiles";
import EditableMarker from "@/components/map/editable-marker";
import NumerosMarkers from "@/components/map/numeros-markers";
import MapMarker from "@/components/map/map-marker";
import PopupFeature from "@/components/map/popup-feature/popup-feature";
import NavControl from "@/components/map/controls/nav-control";
import StyleControl from "@/components/map/controls/style-control";
import AddressEditorControl from "@/components/map/controls/address-editor-control";
import ImageControl from "@/components/map/controls/image-control";
import useBounds from "@/components/map/hooks/bounds";
import useHovered from "@/components/map/hooks/hovered";
import { Numero } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";
import {
  handleSelectToponyme,
  handleSelectVoie,
  resetMapFilter,
  setMapFilter,
} from "@/lib/utils/map";
import GeolocationControl from "./controls/geolocation-control";
import { getStyleDynamically, ortho, planIGN, vector } from "./styles";
import {
  cadastreLayers,
  LAYER as CADASTRE_LAYER,
  SOURCE_LAYER as CADASTRE_SOURCE_LAYER,
} from "./layers/cadastre";
import RulerControl from "./controls/ruler-control";
import PanoramaxControl from "./controls/panoramax-control";
import {
  PANORAMAX_LAYERS_SOURCE,
  PANORAMAX_PICTURE_LAYER_ID,
  PANORAMAX_SOURCE_ID,
  PANORAMAX_TILE_URL,
  panoramaxPictureLayer,
  panoramaxSequenceLayer,
} from "./layers/panoramax";
import LocalStorageContext from "@/contexts/local-storage";

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

export interface MapProps {
  commune: CommuneType;
  isAddressFormOpen: boolean;
  handleAddressForm: (open: boolean) => void;
}

const LAYERS = [...cadastreLayers];

function Map({ commune, isAddressFormOpen, handleAddressForm }: MapProps) {
  const router = useRouter();
  const {
    map,
    isTileSourceLoaded,
    handleMapRef,
    style,
    setStyle,
    isStyleLoaded,
    viewport,
    setViewport,
    isCadastreDisplayed,
    setIsCadastreDisplayed,
    balTilesUrl,
    isMapLoaded,
    tileLayersMode,
  } = useContext(MapContext);
  const { isParcelleSelectionEnabled, handleParcelles } =
    useContext(ParcellesContext);
  const { isMobile } = useContext(LayoutContext);
  const [showPanoramax, setShowPanoramax] = useState(false);

  const [cursor, setCursor] = useState("default");
  const [isContextMenuDisplayed, setIsContextMenuDisplayed] = useState(null);
  const { styleMaps } = useContext(LocalStorageContext);
  const [mapStyle, setMapStyle] = useState<any>(generateNewStyle(style));

  const { balId } = router.query;
  const { voie, toponyme, numeros, editingId, setEditingId, isEditing } =
    useContext(BalDataContext);
  const { hint, drawMode } = useContext(DrawContext);
  const { token } = useContext(TokenContext);

  const [handleHover, handleMouseLeave, featureHovered] = useHovered(map);
  const bounds = useBounds(map, router, commune, voie, toponyme);

  const displayPopupFeature =
    featureHovered !== null &&
    viewport.zoom > 14 &&
    (featureHovered.sourceLayer === LAYERS_SOURCE.VOIES_POINTS ||
      featureHovered.sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS ||
      featureHovered.sourceLayer === LAYERS_SOURCE.TOPONYME_POINTS ||
      featureHovered.sourceLayer === PANORAMAX_LAYERS_SOURCE.PICTURES);

  function getBaseStyle(style: MapStyle | string) {
    if (styleMaps.find(({ id }) => id === style)) {
      return getStyleDynamically(styleMaps.find(({ id }) => id === style));
    }
    switch (style) {
      case MapStyle.ORTHO:
        return ortho;

      case MapStyle.VECTOR:
        return vector;

      case MapStyle.PLAN_IGN:
        return planIGN;
      default:
        return vector;
    }
  }

  function generateNewStyle(style: MapStyle) {
    const baseStyle = getBaseStyle(style);
    return baseStyle.updateIn(["layers"], (arr: any[]) => arr.push(...LAYERS));
  }

  const updatePositionsLayer = useCallback(() => {
    if (map && isTileSourceLoaded) {
      if (voie && drawMode === DrawMode.DRAW_METRIC_VOIE) {
        setMapFilter(map, NUMEROS_POINT, ["==", ["get", "idVoie"], voie.id]);
        setMapFilter(map, NUMEROS_LABEL, ["==", ["get", "idVoie"], voie.id]);
        setMapFilter(map, VOIE_LABEL, ["==", ["get", "id"], voie.id]);
        // Hide all traces
        setMapFilter(map, VOIE_TRACE_LINE, ["==", ["get", "id"], ""]);
        map.setLayerZoomRange(
          NUMEROS_POINT,
          ZOOM.NUMEROS_ZOOM.minZoom,
          ZOOM.NUMEROS_ZOOM.maxZoom
        );
      } else if (voie) {
        setMapFilter(map, VOIE_TRACE_LINE, null);
        setMapFilter(map, NUMEROS_POINT, null);
        setMapFilter(map, NUMEROS_LABEL, ["!=", ["get", "idVoie"], voie.id]);
        setMapFilter(map, VOIE_LABEL, null);
        setMapFilter(map, TOPONYME_LABEL, null);
        // Remove maxZoom filter to see numéros points on all zoom levels
        map.setLayerZoomRange(NUMEROS_POINT, undefined, undefined);
      } else if (toponyme) {
        setMapFilter(map, VOIE_TRACE_LINE, null);
        setMapFilter(map, NUMEROS_POINT, null);
        setMapFilter(map, NUMEROS_LABEL, [
          "!=",
          ["get", "idToponyme"],
          toponyme.id,
        ]);
        setMapFilter(map, VOIE_LABEL, null);
        setMapFilter(map, TOPONYME_LABEL, null);
        // Remove maxZoom filter to see numéros points on all zoom levels
        map.setLayerZoomRange(NUMEROS_POINT, undefined, undefined);
      } else {
        // Remove filter
        resetMapFilter(map);
        map.setLayerZoomRange(
          NUMEROS_POINT,
          ZOOM.NUMEROS_ZOOM.minZoom,
          ZOOM.NUMEROS_ZOOM.maxZoom
        );
      }
    }
  }, [map, voie, isTileSourceLoaded, drawMode, toponyme]);

  const interactiveLayerIds = useMemo(() => {
    const layers = [];

    if (isParcelleSelectionEnabled && isCadastreDisplayed) {
      return ["parcelles-fill"];
    }

    if (!isEditing && isTileSourceLoaded) {
      layers.push(
        VOIE_TRACE_LINE,
        NUMEROS_POINT,
        NUMEROS_LABEL,
        VOIE_LABEL,
        TOPONYME_LABEL,
        PANORAMAX_PICTURE_LAYER_ID
      );
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
        .filter(({ source }) => {
          return (
            source === "cadastre" ||
            source === "tiles" ||
            source === "panoramax"
          );
        });
      const feature = features && features[0];
      const source = feature && feature.source;

      switch (source) {
        case "cadastre": {
          const parcelles = features.filter(
            ({ source, sourceLayer, layer }) =>
              source === "cadastre" &&
              sourceLayer === CADASTRE_SOURCE_LAYER.PARCELLES &&
              layer?.id === CADASTRE_LAYER.PARCELLES_FILL
          );

          if (parcelles.length > 0) {
            handleParcelles(parcelles.map(({ properties }) => properties.id));
          }
          break;
        }
        case "tiles": {
          if (feature && !isEditing) {
            if (tileLayersMode === TilesLayerMode.TOPONYME) {
              handleSelectToponyme(feature, router, balId as string);
            } else {
              handleSelectVoie(feature, router, balId as string);
            }
          }
          break;
        }
        case "panoramax": {
          if (feature.sourceLayer === PANORAMAX_LAYERS_SOURCE.PICTURES) {
            const pictureId = feature.properties.id;
            window.open(
              `${process.env.NEXT_PUBLIC_PANORAMAX_API_ENDPOINT}/?focus=pic&pic=${pictureId}`,
              "_blank",
              "noreferrer"
            );
          }
          break;
        }
        default:
          break;
      }

      setIsContextMenuDisplayed(null);
    },
    [
      router,
      balId,
      setEditingId,
      isEditing,
      voie,
      handleParcelles,
      tileLayersMode,
    ]
  );

  useEffect(() => {
    if (drawMode) {
      setCursor("crosshair");
    } else if (featureHovered) {
      setCursor("pointer");
    } else {
      setCursor("default");
    }
  }, [drawMode, featureHovered]);

  // Hide current voie's or toponyme's numeros
  useEffect(() => {
    updatePositionsLayer();
  }, [map, voie, toponyme, updatePositionsLayer]);

  // Change map's style and adapte layers
  useEffect(() => {
    if (map) {
      setMapStyle(generateNewStyle(style));
    }
  }, [map, style]);

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
          12,
          0.8,
          13,
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

      <Pane
        position="absolute"
        zIndex={1}
        top={90}
        right={10}
        display="flex"
        flexDirection="column"
        gap={8}
      >
        {token && !isMobile && (
          <AddressEditorControl
            isAddressFormOpen={isAddressFormOpen}
            handleAddressForm={handleAddressForm}
            isDisabled={isEditing && !isAddressFormOpen}
          />
        )}
        {!isMobile && <ImageControl map={map} communeNom={commune.nom} />}
        {!isMobile && <RulerControl disabled={isEditing} />}
        {isMobile && navigator.geolocation && <GeolocationControl map={map} />}
        <PanoramaxControl
          commune={commune}
          map={map}
          showPanoramax={showPanoramax}
          setShowPanoramax={setShowPanoramax}
        />
      </Pane>

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
          mapStyle={mapStyle}
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
            {Object.values(getTilesLayers(tileLayersMode)).map((layer) => (
              <Layer key={layer.id} {...(layer as LayerProps)} />
            ))}
          </Source>

          <Source
            id={PANORAMAX_SOURCE_ID}
            type="vector"
            tiles={[PANORAMAX_TILE_URL]}
          >
            <Layer
              {...(panoramaxSequenceLayer as LayerProps)}
              paint={
                {
                  ...panoramaxSequenceLayer.paint,
                  "line-opacity": showPanoramax ? 1 : 0,
                } as any
              }
            />
            <Layer
              {...(panoramaxPictureLayer as LayerProps)}
              layout={{ visibility: showPanoramax ? "visible" : "none" }}
            />
          </Source>

          {(voie || toponyme) && !drawMode && numeros && (
            <NumerosMarkers
              numeros={numeros.filter(({ id }) => id !== editingId) as Numero[]}
              isContextMenuDisplayed={isContextMenuDisplayed}
              setIsContextMenuDisplayed={setIsContextMenuDisplayed}
              color={selectedVoieColor}
            />
          )}

          {isEditing && (
            <EditableMarker
              style={style}
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

          {displayPopupFeature && (
            <PopupFeature feature={featureHovered} commune={commune} />
          )}
        </MapGl>
      </Pane>
    </Pane>
  );
}

export default Map;
