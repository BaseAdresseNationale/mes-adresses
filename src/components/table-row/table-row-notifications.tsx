import { useContext } from "react";
import {
  Table,
  Position,
  Tooltip,
  EndorsedIcon,
  WarningSignIcon,
  CommentIcon,
  OfficeIcon,
} from "evergreen-ui";
import TokenContext from "@/contexts/token";

interface TableRowNotificationsProps {
  certification?: string;
  comment?: string | React.ReactNode;
  warning?: string | React.ReactNode;
  communeDeleguee?: string;
}

function TableRowNotifications({
  certification,
  comment,
  warning,
  communeDeleguee,
}: TableRowNotificationsProps) {
  const { token } = useContext(TokenContext);
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
          <Tooltip content={certification} position={Position.BOTTOM_RIGHT}>
            <EndorsedIcon color="success" style={{ verticalAlign: "bottom" }} />
          </Tooltip>
        </Table.TextCell>
      )}

      {warning && (
        <Table.TextCell flex="0 1 1" paddingLeft="8px" paddingRight="8px">
          <Tooltip
            content={warning}
            position={Position.BOTTOM_RIGHT}
            statelessProps={{ maxWidth: "500px" }}
          >
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
