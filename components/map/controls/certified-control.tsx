import { useState } from "react";
import type { Map as MaplibreMap } from "maplibre-gl";
import { Tooltip, Position, IconButton, EndorsedIcon } from "evergreen-ui";
import { NUMEROS_LABEL, NUMEROS_POINT } from "../layers/tiles";

interface CertifiedControlProps {
  map: MaplibreMap | null;
  style: string;
}

function CertifiedControl({ map, style }: CertifiedControlProps) {
  const [showUncertified, setShowUncertified] = useState(false);
  const isOrtho = style === "ortho";

  const showUncertifiedInLayerNumeroPoint = () => {
    map.setPaintProperty(NUMEROS_POINT, "circle-stroke-color", [
      "case",
      ["get", "certifie"],
      isOrtho ? "#ffffff" : "#f8f4f0",
      "#000000",
    ]);
    map.setPaintProperty(NUMEROS_POINT, "circle-stroke-width", [
      "case",
      ["get", "certifie"],
      1,
      4,
    ]);
  };

  const showUncertifiedInLayerNumeroLabel = () => {
    map.setPaintProperty(NUMEROS_LABEL, "text-color", [
      "case",
      ["get", "certifie"],
      "#ffffff",
      "#000000",
    ]);
  };

  const showUncertifierAdresses = () => {
    setShowUncertified(true);
    showUncertifiedInLayerNumeroPoint();
    showUncertifiedInLayerNumeroLabel();
  };

  const showNormalLayerNumeroPoint = () => {
    map.setPaintProperty(
      NUMEROS_POINT,
      "circle-stroke-color",
      isOrtho ? "#ffffff" : "#f8f4f0"
    );
    map.setPaintProperty(NUMEROS_POINT, "circle-stroke-width", {
      stops: [
        [12, 0.3],
        [17, 0.8],
      ],
    });
  };

  const showNormalLayerNumeroLabel = () => {
    map.setPaintProperty(NUMEROS_LABEL, "text-color", "#ffffff");
  };

  const unshowUncertifierAdresses = () => {
    setShowUncertified(false);
    showNormalLayerNumeroPoint();
    showNormalLayerNumeroLabel();
  };

  return (
    <Tooltip
      position={Position.LEFT}
      content={showUncertified ? "Annuler" : "Voir les adresses non certifiées"}
    >
      {showUncertified ? (
        <IconButton
          height={29}
          width={29}
          icon={EndorsedIcon}
          intent="danger"
          onClick={unshowUncertifierAdresses}
        />
      ) : (
        <IconButton
          height={29}
          width={29}
          icon={EndorsedIcon}
          intent="none"
          onClick={showUncertifierAdresses}
        />
      )}
    </Tooltip>
  );
}

export default CertifiedControl;
