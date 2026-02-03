import React from "react";
import { StyleAttribute } from "glamor";
import { Marker } from "react-map-gl/maplibre";
import {
  Pane,
  Text,
  Menu,
  Position,
  TrashIcon,
  EndorsedIcon,
} from "evergreen-ui";
import { Tooltip } from "evergreen-ui";

import { computeCompletNumero } from "@/lib/utils/numero";
import { Numero } from "@/lib/openapi-api-bal";

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
      offset={[-5, 6]}
      longitude={coordinates[0]}
      latitude={coordinates[1]}
    >
      <Pane
        {...style}
        paddingX={4}
        onClick={() => onEnableEditing(numero.id)}
        onTouchEnd={() => onEnableEditing(numero.id)}
        onContextMenu={() => onEnableMenu(numero.id)}
      >
        <Text color="white" marginLeft={8} marginRight={4}>
          {completNumero}
        </Text>

        {numero.certifie && (
          <Tooltip
            content="Cette adresse est certifiée"
            position={Position.BOTTOM_RIGHT}
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
                onSelect={() => removeAddress(numero.id)}
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
