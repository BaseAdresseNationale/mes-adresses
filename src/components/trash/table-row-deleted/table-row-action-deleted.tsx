import React from "react";
import {
  Table,
  Popover,
  Menu,
  Position,
  IconButton,
  MoreIcon,
} from "evergreen-ui";

interface TableRowActionsProps {
  actions: { label: string; icon: any; callback: () => void; intent: string }[];
}

const TableRowActions = React.memo(function TableRowActions({
  actions,
}: TableRowActionsProps) {
  return (
    <Table.TextCell flex="0 1 1">
      <Popover
        position={Position.BOTTOM_LEFT}
        content={
          <Menu>
            <Menu.Group>
              {actions.map((a) => {
                return (
                  <Menu.Item
                    key={a.label}
                    icon={a.icon}
                    onSelect={a.callback}
                    intent={a.intent}
                  >
                    {a.label}
                  </Menu.Item>
                );
              })}
            </Menu.Group>
          </Menu>
        }
      >
        <IconButton
          type="button"
          height={24}
          icon={MoreIcon}
          appearance="minimal"
        />
      </Popover>
    </Table.TextCell>
  );
});

export default TableRowActions;
