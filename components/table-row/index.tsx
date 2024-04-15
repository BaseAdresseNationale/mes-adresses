import React from "react";
import { Table, Checkbox, IconButton, LockIcon } from "evergreen-ui";

import TableRowActions from "@/components/table-row/table-row-actions";
import TableRowEditShortcut from "@/components/table-row/table-row-edit-shortcut";
import TableRowNotifications from "@/components/table-row/table-row-notifications";

interface TableRowProps {
  label: string;
  nomAlt?: Record<string, string>;
  complement?: string;
  secondary?: string;
  handleSelect?: () => void;
  isSelected?: boolean;
  isEditing: boolean;
  isAdmin: boolean;
  notifications?: any;
  actions?: {
    onSelect?: () => void;
    onEdit: () => void;
    onRemove: () => void;
    extra?: {
      callback: () => void;
      icon: any;
      text: string;
    };
  };
  openRecoveryDialog?: () => void;
}

function TableRow({
  label,
  nomAlt,
  complement,
  secondary,
  notifications,
  isSelected = false,
  isEditing,
  isAdmin,
  handleSelect,
  openRecoveryDialog,
  actions,
}: TableRowProps) {
  const { onSelect } = actions;
  const isEditingEnabled = !isEditing && isAdmin;

  return (
    <Table.Row paddingRight={8} minHeight={48}>
      {isEditingEnabled && handleSelect && (
        <Table.Cell flex="0 1 1">
          <Checkbox checked={isSelected} onChange={handleSelect} />
        </Table.Cell>
      )}

      <TableRowEditShortcut
        label={label}
        nomAlt={nomAlt}
        complement={complement}
        onClick={onSelect}
      />

      {secondary && <Table.TextCell flex="0 1 1">{secondary}</Table.TextCell>}

      {notifications && <TableRowNotifications {...notifications} />}

      {isEditingEnabled && actions && <TableRowActions {...actions} />}

      {!isAdmin && (
        <Table.TextCell flex="0 1 1">
          <IconButton
            onClick={openRecoveryDialog}
            type="button"
            height={24}
            icon={LockIcon}
            appearance="minimal"
          />
        </Table.TextCell>
      )}
    </Table.Row>
  );
}

export default TableRow;
