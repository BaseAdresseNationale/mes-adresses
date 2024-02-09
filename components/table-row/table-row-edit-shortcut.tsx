import React, { useState } from "react";
import { Pane, Table, EditIcon, Text, Tooltip, Position } from "evergreen-ui";

import LanguagePreview from "../bal/language-preview";

interface TableRowEditShortcutProps {
  label: string;
  nomAlt?: any;
  complement?: string;
  colors?: any;
  isEditingEnabled: boolean;
  isSelectable: boolean;
}

function TableRowEditShortcut({
  label,
  nomAlt,
  complement,
  colors = {},
  isEditingEnabled,
  isSelectable,
}: TableRowEditShortcutProps) {
  const [hoveredEdit, setHoveredEdit] = useState(false);

  const CellComponent = (
    <Table.Cell
      data-browsable
      className={`table-row-edit-shortcut${isSelectable ? " selectable" : ""}`}
    >
      <Table.TextCell
        data-editable
        flex="0 1 1"
        style={{ cursor: isSelectable ? "pointer" : "default" }}
        className="edit-cell"
        onMouseEnter={() => {
          setHoveredEdit(isEditingEnabled);
        }}
        onMouseLeave={() => {
          setHoveredEdit(false);
        }}
      >
        <Pane padding={1} fontSize={15}>
          <Text color={colors.label ? colors.label : "default"}>{label}</Text>
          {complement && (
            <Text color={colors.complement ? colors.complement : "default"}>
              <i>{` - ${complement}`}</i>
            </Text>
          )}
          {isEditingEnabled && (
            <span className="pencil-icon">
              <EditIcon marginBottom={-4} marginLeft={8} />
            </span>
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

  return isSelectable ? (
    <Tooltip
      showDelay={500}
      content={hoveredEdit ? "Modifier le libellé" : "Consulter les numéros"}
      position={Position.BOTTOM}
    >
      {CellComponent}
    </Tooltip>
  ) : (
    CellComponent
  );
}

export default TableRowEditShortcut;
