import { useState, useEffect, useContext } from "react";
import type { Map as MaplibreMap } from "maplibre-gl";
import {
  Position,
  IconButton,
  Popover,
  Pane,
  CameraIcon,
  Button,
} from "evergreen-ui";
import {
  NUMEROS_POINT,
  NUMEROS_LABEL,
  VOIE_LABEL,
  VOIE_TRACE_LINE,
  TOPONYME_LABEL,
  TilesLayerMode,
} from "@/components/map/layers/tiles";
import MapContext from "@/contexts/map";
import LayerShowHideControl from "./layer-show-hide-control";
import { getImageBase64 } from "@/lib/utils/map";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

const poiLayersIds = ["poi-level-1", "poi-level-2", "poi-level-3"];

interface ImageControlProps {
  map: MaplibreMap | null;
  communeNom: string;
}

function ImageControl({ map, communeNom }: ImageControlProps) {
  const { tileLayersMode } = useContext(MapContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const [adresseLayerIsDisplayed, setAdresseLayerIsDisplayed] =
    useState<boolean>(true);
  const [voieLayerIsDisplayed, setVoieLayerIsDisplayed] =
    useState<boolean>(true);
  const [toponymeLayerIsDisplayed, setToponymeLayerIsDisplayed] =
    useState<boolean>(true);
  const [poiLayerIsDisplayed, setPoiLayerIsDisplayed] = useState<boolean>(true);

  const tileLayerEnabled = tileLayersMode !== TilesLayerMode.HIDDEN;

  useEffect(() => {
    if (map) {
      if (map.getLayer(TOPONYME_LABEL)) {
        map.setLayoutProperty(
          TOPONYME_LABEL,
          "visibility",
          toponymeLayerIsDisplayed ? "visible" : "none"
        );
      }
    }
  }, [map, toponymeLayerIsDisplayed]);

  useEffect(() => {
    if (map) {
      if (map.getLayer(NUMEROS_POINT)) {
        map.setLayoutProperty(
          NUMEROS_POINT,
          "visibility",
          adresseLayerIsDisplayed ? "visible" : "none"
        );
      }

      if (map.getLayer(NUMEROS_LABEL)) {
        map.setLayoutProperty(
          NUMEROS_LABEL,
          "visibility",
          adresseLayerIsDisplayed ? "visible" : "none"
        );
      }
    }
  }, [map, adresseLayerIsDisplayed]);

  useEffect(() => {
    if (map) {
      if (map.getLayer(VOIE_LABEL)) {
        map.setLayoutProperty(
          VOIE_LABEL,
          "visibility",
          voieLayerIsDisplayed ? "visible" : "none"
        );
      }

      if (map.getLayer(VOIE_TRACE_LINE)) {
        map.setLayoutProperty(
          VOIE_TRACE_LINE,
          "visibility",
          voieLayerIsDisplayed ? "visible" : "none"
        );
      }
    }
  }, [map, voieLayerIsDisplayed]);

  useEffect(() => {
    if (map) {
      poiLayersIds.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(
            layerId,
            "visibility",
            poiLayerIsDisplayed ? "visible" : "none"
          );
        }
      });
    }
  }, [map, poiLayerIsDisplayed]);

  const initLayer = () => {
    setAdresseLayerIsDisplayed(true);
    setToponymeLayerIsDisplayed(true);
    setVoieLayerIsDisplayed(true);
    setPoiLayerIsDisplayed(true);
  };

  const takeScreenshot = async () => {
    try {
      const imageBase64: string = await getImageBase64(map);
      const a: HTMLAnchorElement = document.createElement("a");
      a.href = imageBase64;
      a.download = `Screenshot-${communeNom}.png`;
      a.click();
      matomoTrackEvent(
        MatomoEventCategory.MAP,
        MatomoEventAction[MatomoEventCategory.MAP].TAKE_SCREENSHOT
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Popover
      position={Position.LEFT}
      onClose={() => initLayer()}
      content={
        <Pane
          paddingX={18}
          paddingY={12}
          width={200}
          display="flex"
          flexDirection="column"
        >
          {tileLayerEnabled && (
            <LayerShowHideControl
              title="Numéros"
              isDiplayed={adresseLayerIsDisplayed}
              setIsDiplayed={setAdresseLayerIsDisplayed}
            />
          )}

          {tileLayerEnabled && tileLayersMode !== TilesLayerMode.TOPONYME && (
            <LayerShowHideControl
              title="Voies"
              isDiplayed={voieLayerIsDisplayed}
              setIsDiplayed={setVoieLayerIsDisplayed}
            />
          )}

          {tileLayerEnabled && tileLayersMode !== TilesLayerMode.VOIE && (
            <LayerShowHideControl
              title="Toponymes"
              isDiplayed={toponymeLayerIsDisplayed}
              setIsDiplayed={setToponymeLayerIsDisplayed}
            />
          )}

          <LayerShowHideControl
            title="Points d'intérets"
            isDiplayed={poiLayerIsDisplayed}
            setIsDiplayed={setPoiLayerIsDisplayed}
          />

          <Button onClick={takeScreenshot}>
            <CameraIcon marginRight={4} />
            Prendre une photo
          </Button>
        </Pane>
      }
    >
      <IconButton
        height={29}
        width={29}
        icon={CameraIcon}
        title="Prendre une photo de la carte"
      />
    </Popover>
  );
}

export default ImageControl;
