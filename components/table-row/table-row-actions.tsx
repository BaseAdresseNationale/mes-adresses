import React from "react";
import {
  Table,
  Popover,
  Menu,
  Position,
  IconButton,
  EditIcon,
  MoreIcon,
  SendToMapIcon,
  TrashIcon,
} from "evergreen-ui";

interface TableRowActionsProps {
  onSelect?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  extra?: {
    callback: () => void;
    icon: React.ElementType;
    text: string;
  };
}

const TableRowActions = React.memo(function TableRowActions({
  onSelect,
  onEdit,
  onRemove,
  extra,
}: TableRowActionsProps) {
  return (
    <Table.TextCell flex="0 1 1">
      <Popover
        position={Position.BOTTOM_LEFT}
        content={
          <Menu>
            <Menu.Group>
              {onSelect && (
                <Menu.Item icon={SendToMapIcon} onSelect={onSelect}>
                  Consulter
                </Menu.Item>
              )}
              {onEdit && (
                <Menu.Item icon={EditIcon} onSelect={onEdit}>
                  Modifier
                </Menu.Item>
              )}
              {extra && (
                <Menu.Item icon={extra.icon} onSelect={extra.callback}>
                  {extra.text}
                </Menu.Item>
              )}
              {onRemove && (
                <Menu.Item icon={TrashIcon} intent="danger" onSelect={onRemove}>
                  Supprimer…
                </Menu.Item>
              )}
            </Menu.Group>
          </Menu>
        }
      >
        <IconButton
          type="button"
          height={24}
          icon={MoreIcon}
          appearance="minimal"
          title="Actions"
        />
      </Popover>
    </Table.TextCell>
  );
});

export default TableRowActions;
