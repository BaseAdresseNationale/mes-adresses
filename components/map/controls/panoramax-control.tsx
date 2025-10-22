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
import { PANORAMAX_LAYERS_SOURCE } from "../layers/panoramax";

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

    const checkPanoramaxData = () => {
      const sequences = map?.querySourceFeatures("panoramax", {
        sourceLayer: PANORAMAX_LAYERS_SOURCE.SEQUENCES,
        filter: [
          "within",
          commune.contour || {
            type: "Polygon",
            coordinates: [
              [
                [commune.bbox[0], commune.bbox[1]],
                [commune.bbox[0], commune.bbox[3]],
                [commune.bbox[2], commune.bbox[3]],
                [commune.bbox[2], commune.bbox[1]],
              ],
            ],
          },
        ],
      });

      setDisabled(!(sequences && sequences.length > 0));
    };

    checkPanoramaxData();

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
              Aucune données Panoramax n&apos;est disponible pour cette commune.
            </Text>
          </Pane>
          <Button
            is="a"
            size="small"
            href="https://panoramax.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            En savoir plus
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
