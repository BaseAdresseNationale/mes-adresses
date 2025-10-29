import {
  CrossIcon,
  IconButton,
  Pane,
  Tooltip,
  Text,
  Button,
} from "evergreen-ui";
import Image from "next/image";
import type { Map as MaplibreMap } from "maplibre-gl";
import { useEffect, useState } from "react";
import { CommuneType } from "@/types/commune";
import {
  PANORAMAX_LAYERS_SOURCE,
  PANORAMAX_SOURCE_ID,
} from "../layers/panoramax";

interface PanoramaxControlProps {
  map: MaplibreMap | null;
  setShowPanoramax: (show: boolean) => void;
  showPanoramax: boolean;
  commune: CommuneType;
}

function PanoramaxControl({
  map,
  setShowPanoramax,
  showPanoramax,
  commune,
}: PanoramaxControlProps) {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (map && showPanoramax) {
      // Rerender the map to avoid tiles remaining on screen
      map.zoomTo(map.getZoom());
    }
  }, [map, showPanoramax]);

  useEffect(() => {
    if (!map) {
      setDisabled(true);
      return;
    }

    const checkPanoramaxData = (e) => {
      if (e.sourceId === PANORAMAX_SOURCE_ID && e.isSourceLoaded) {
        const sequences = map?.querySourceFeatures(PANORAMAX_SOURCE_ID, {
          sourceLayer: PANORAMAX_LAYERS_SOURCE.SEQUENCES,
        });

        setDisabled(!(sequences && sequences.length > 0));
      }
    };

    map.on("sourcedata", checkPanoramaxData);

    return () => {
      map.off("sourcedata", checkPanoramaxData);
    };
  }, [map, commune]);

  const enabledButton = (
    <IconButton
      disabled={disabled}
      onClick={() => setShowPanoramax(true)}
      height={29}
      width={29}
      icon={
        <Image
          src="/static/images/panoramax.svg"
          alt="Panoramax logo"
          width={20}
          height={20}
          style={{ filter: disabled ? "grayscale(1) opacity(0.5)" : "none" }}
        />
      }
      title="Ouvrir Panoramax"
    />
  );

  return showPanoramax ? (
    <IconButton
      height={29}
      width={29}
      icon={CrossIcon}
      onClick={() => setShowPanoramax(false)}
      title="Fermer Panoramax"
    />
  ) : disabled ? (
    <Tooltip
      content={
        <>
          <Pane marginBottom={8}>
            <Text color="white">
              Aucune photographie du territoire n&apos;est disponible.
            </Text>
          </Pane>
          <Button
            is="a"
            size="small"
            href="https://panoramax.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Participer à Panoramax
          </Button>
        </>
      }
    >
      <div>{enabledButton}</div>
    </Tooltip>
  ) : (
    enabledButton
  );
}

export default PanoramaxControl;
