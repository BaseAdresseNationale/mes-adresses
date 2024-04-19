import React from "react";
import {
  Table,
  Checkbox,
  IconButton,
  LockIcon,
  Pane,
  Text,
} from "evergreen-ui";

import TableRowActions from "@/components/table-row/table-row-actions";
import TableRowNotifications from "@/components/table-row/table-row-notifications";
import LanguagePreview from "../bal/language-preview";

interface TableRowProps {
  label: string;
  nomAlt?: Record<string, any>;
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
  const { onSelect, onEdit } = actions;
  const isEditingEnabled = !isEditing && isAdmin;

  return (
    <Table.Row paddingRight={8} minHeight={48}>
      {isEditingEnabled && handleSelect && (
        <Table.Cell flex="0 1 1">
          <Checkbox checked={isSelected} onChange={handleSelect} />
        </Table.Cell>
      )}

      <Table.Cell onClick={onSelect || onEdit} cursor="pointer">
        <Table.TextCell data-editable flex="0 1 1" height="100%">
          <Pane padding={1} fontSize={15}>
            <Text>{label}</Text>
            {complement && (
              <Text>
                <i>{` - ${complement}`}</i>
              </Text>
            )}
          </Pane>

          {nomAlt && (
            <Pane marginTop={4}>
              <LanguagePreview nomAlt={nomAlt} />
            </Pane>
          )}
        </Table.TextCell>
      </Table.Cell>

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
