import React from "react";
import {
  Table,
  Popover,
  Menu,
  Position,
  IconButton,
  MoreIcon,
  IconComponent,
  IntentTypes,
} from "evergreen-ui";

export interface ActionProps {
  label: string;
  callback: () => void;
  icon: IconComponent;
  intent: IntentTypes;
}

interface TableRowActionsProps {
  actions: ActionProps[];
}

const TableRowActions = React.memo(function TableRowActions({
  actions = [],
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
