import React from "react";
import { StyleAttribute } from "glamor";
import { Marker } from "react-map-gl";
import {
  Pane,
  Text,
  Menu,
  Position,
  WarningSignIcon,
  TrashIcon,
  EndorsedIcon,
} from "evergreen-ui";
import { Tooltip } from "evergreen-ui/commonjs/tooltip";

import { computeCompletNumero } from "@/lib/utils/numero";
import { Numero } from "@/lib/openapi";

interface NumeroMarkerProps {
  numero: Numero;
  isContextMenuDisplayed: boolean;
  style: StyleAttribute;
  onEnableEditing: (numeroId: string) => void;
  onEnableMenu: (numeroId: string) => void;
  removeAddress: (numeroId: string) => Promise<void>;
}

function NumeroMarker({
  numero,
  style,
  isContextMenuDisplayed = false,
  onEnableEditing,
  onEnableMenu,
  removeAddress,
}: NumeroMarkerProps) {
  const position =
    numero.positions.find((position) => position.type === "entrée") ||
    numero.positions[0];

  if (!position) {
    return null;
  }

  const { coordinates } = position.point;
  const completNumero =
    numero.numeroComplet || computeCompletNumero(numero.numero, numero.suffixe);

  return (
    <Marker
      anchor="left"
      offset={[-4, 14]}
      longitude={coordinates[0]}
      latitude={coordinates[1]}
    >
      <Pane
        {...style}
        paddingX={4}
        onClick={() => onEnableEditing(numero._id)}
        onTouchEnd={() => onEnableEditing(numero._id)}
        onContextMenu={() => onEnableMenu(numero._id)}
      >
        <Text color="white" marginLeft={8} marginRight={4}>
          {completNumero}
        </Text>

        {numero.positions.find((position) => position.type === "inconnue") && (
          <Tooltip
            content="Le type d’une position est inconnu"
            position={Position.BOTTOM_RIGHT}
          >
            <WarningSignIcon
              color="warning"
              size={13}
              marginX={4}
              marginBottom={2}
              style={{ verticalAlign: "middle" }}
            />
          </Tooltip>
        )}

        {numero.certifie && (
          <Tooltip
            content="Cette adresse est certifiée par la commune"
            position={Position.RIGHT}
          >
            <EndorsedIcon
              color="success"
              size={13}
              marginX={4}
              marginBottom={2}
              style={{ verticalAlign: "middle" }}
            />
          </Tooltip>
        )}
      </Pane>

      {isContextMenuDisplayed && (
        <Pane background="tint1" position="absolute" margin={10}>
          <Menu>
            <Menu.Group>
              <Menu.Item
                icon={TrashIcon}
                intent="danger"
                onSelect={() => removeAddress(numero._id)}
              >
                Supprimer
              </Menu.Item>
            </Menu.Group>
          </Menu>
        </Pane>
      )}
    </Marker>
  );
}

export default React.memo(NumeroMarker);
