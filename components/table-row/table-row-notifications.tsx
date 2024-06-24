import { useContext } from "react";
import {
  Table,
  Position,
  Tooltip,
  EndorsedIcon,
  WarningSignIcon,
  CommentIcon,
} from "evergreen-ui";
import TokenContext from "@/contexts/token";

interface TableRowNotificationsProps {
  certification?: string;
  comment?: string | React.ReactNode;
  warning?: string;
  uncertified?: string;
}

function TableRowNotifications({
  certification,
  comment,
  warning,
  uncertified,
}: TableRowNotificationsProps) {
  const { token } = useContext(TokenContext);

  return (
    <>
      {comment && token && (
        <Table.Cell flex="0 1 1">
          <Tooltip content={comment} position={Position.BOTTOM_RIGHT}>
            <CommentIcon color="muted" />
          </Tooltip>
        </Table.Cell>
      )}

      {certification && (
        <Table.TextCell flex="0 1 1">
          <Tooltip content={certification} position={Position.BOTTOM}>
            <EndorsedIcon color="success" style={{ verticalAlign: "bottom" }} />
          </Tooltip>
        </Table.TextCell>
      )}

      {uncertified && (
        <Table.TextCell flex="0 1 1">
          <Tooltip content={uncertified} position={Position.BOTTOM}>
            <EndorsedIcon color="danger" style={{ verticalAlign: "bottom" }} />
          </Tooltip>
        </Table.TextCell>
      )}

      {warning && (
        <Table.TextCell flex="0 1 1">
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
