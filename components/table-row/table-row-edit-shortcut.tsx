import React, { useState } from "react";
import { Pane, Table, EditIcon, Text, Tooltip, Position } from "evergreen-ui";

import LanguagePreview from "../bal/language-preview";

interface TableRowEditShortcutProps {
  label: string;
  nomAlt?: Record<string, string>;
  complement?: string;
  colors?: any;
  onClick?: () => void | null;
}

function TableRowEditShortcut({
  label,
  nomAlt,
  complement,
  colors = {},
  onClick,
}: TableRowEditShortcutProps) {
  const CellComponent = (
    <Table.Cell
      data-browsable
      className={`table-row-edit-shortcut${onClick ? " selectable" : ""}`}
      onClick={onClick}
    >
      <Table.TextCell
        data-editable
        flex="0 1 1"
        height="100%"
        style={{ cursor: onClick ? "pointer" : "default" }}
        className="edit-cell"
      >
        <Pane padding={1} fontSize={15}>
          <Text color={colors.label ? colors.label : "default"}>{label}</Text>
          {complement && (
            <Text color={colors.complement ? colors.complement : "default"}>
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

      <style global jsx>{`
        .table-row-edit-shortcut.selectable:hover {
          background-color: #e4e7eb;
          cursor: pointer;
        }
        .edit-cell .pencil-icon {
          display: none;
        }

        .edit-cell:hover .pencil-icon {
          display: inline-block;
        }
      `}</style>
    </Table.Cell>
  );

  return onClick ? (
    <Tooltip
      showDelay={500}
      content="Consulter les numéros"
      position={Position.BOTTOM}
    >
      {CellComponent}
    </Tooltip>
  ) : (
    CellComponent
  );
}

export default TableRowEditShortcut;
