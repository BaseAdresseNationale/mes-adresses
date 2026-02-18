import { useContext } from "react";
import {
  Table,
  Position,
  Tooltip,
  EndorsedIcon,
  CommentIcon,
  OfficeIcon,
  Popover,
  defaultTheme,
  LightbulbIcon,
  Menu,
  Ul,
  IconButton,
  Link,
  Li,
  Pane,
  Button,
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
          <Popover position={Position.BOTTOM_LEFT} content={warning}>
            <Button
              borderColor={defaultTheme.colors.purple100}
              paddingLeft={4}
              paddingRight={4}
            >
              <LightbulbIcon color={defaultTheme.colors.purple600} />
            </Button>
          </Popover>
        </Table.TextCell>
      )}
    </>
  );
}

export default TableRowNotifications;
