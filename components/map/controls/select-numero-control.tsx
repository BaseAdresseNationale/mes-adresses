import DrawContext from "@/contexts/draw";
import {
  Tooltip,
  Position,
  IconButton,
  PolygonFilterIcon,
  CrossIcon,
} from "evergreen-ui";
import { useContext } from "react";

function SelectNumeroControl() {
  const { drawEnabled, enableDrawPolygon, disableDrawPolygon } =
    useContext(DrawContext);

  return (
    <Tooltip
      position={Position.LEFT}
      content={drawEnabled ? "Annuler" : "Modifier plusieurs adresses"}
    >
      {drawEnabled ? (
        <IconButton
          height={29}
          width={29}
          icon={CrossIcon}
          onClick={disableDrawPolygon}
        />
      ) : (
        <IconButton
          height={29}
          width={29}
          icon={PolygonFilterIcon}
          intent="success"
          appearance="primary"
          onClick={enableDrawPolygon}
        />
      )}
    </Tooltip>
  );
}

export default SelectNumeroControl;
