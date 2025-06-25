import { useContext, useMemo } from "react";
import {
  Table,
  Position,
  Tooltip,
  EndorsedIcon,
  WarningSignIcon,
  CommentIcon,
  OfficeIcon,
  ControlIcon,
} from "evergreen-ui";
import TokenContext from "@/contexts/token";
import ParcellesContext from "@/contexts/parcelles";

interface TableRowNotificationsProps {
  certification?: string;
  comment?: string | React.ReactNode;
  warning?: string;
  communeDeleguee?: string;
  parcelles?: string[];
}

function TableRowNotifications({
  certification,
  comment,
  warning,
  communeDeleguee,
  parcelles,
}: TableRowNotificationsProps) {
  const { token } = useContext(TokenContext);
  const { communeParcelles } = useContext(ParcellesContext);

  const parcellesIsInCommune = useMemo(
    () => parcelles?.every((parcelle) => communeParcelles.has(parcelle)),
    [parcelles, communeParcelles]
  );

  return (
    <>
      {communeDeleguee && (
        <Table.Cell flex="0 1 1" paddingLeft="8px" paddingRight="8px">
          <Tooltip content={communeDeleguee} position={Position.BOTTOM_RIGHT}>
            <OfficeIcon color="muted" />
          </Tooltip>
        </Table.Cell>
      )}
      {comment && token && (
        <Table.Cell flex="0 1 1" paddingLeft="8px" paddingRight="8px">
          <Tooltip content={comment} position={Position.BOTTOM_RIGHT}>
            <CommentIcon color="muted" />
          </Tooltip>
        </Table.Cell>
      )}

      {certification && (
        <Table.TextCell flex="0 1 1" paddingLeft="8px" paddingRight="8px">
          <Tooltip content={certification} position={Position.BOTTOM}>
            <EndorsedIcon color="success" style={{ verticalAlign: "bottom" }} />
          </Tooltip>
        </Table.TextCell>
      )}

      {parcelles?.length > 0 && !parcellesIsInCommune && (
        <Table.TextCell flex="0 1 1" paddingLeft="8px" paddingRight="8px">
          <Tooltip
            content="Une parcelle ne correspond pas"
            position={Position.BOTTOM}
          >
            <ControlIcon color="warning" />
          </Tooltip>
        </Table.TextCell>
      )}

      {warning && (
        <Table.TextCell flex="0 1 1" paddingLeft="8px" paddingRight="8px">
          <Tooltip content={warning} position={Position.BOTTOM}>
            <WarningSignIcon
              color="warning"
              style={{ verticalAlign: "bottom" }}
            />
          </Tooltip>
        </Table.TextCell>
      )}
    </>
  );
}

export default TableRowNotifications;
