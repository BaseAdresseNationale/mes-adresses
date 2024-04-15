import { Table, Checkbox } from "evergreen-ui";

import TableRowEditShortcut from "@/components/table-row/table-row-edit-shortcut";

interface RowNumerosDeletedProps {
  label: string;
  handleSelect;
  secondary?: string;
  isSelected?: boolean;
}

function RowNumerosDeleted({
  label,
  handleSelect,
  secondary = null,
  isSelected = false,
}: RowNumerosDeletedProps) {
  return (
    <Table.Row paddingRight={8} minHeight={48}>
      {handleSelect && (
        <Table.Cell flex="0 1 1">
          <Checkbox checked={isSelected} onChange={handleSelect} />
        </Table.Cell>
      )}

      <TableRowEditShortcut label={label} />

      {secondary && <Table.TextCell flex="0 1 1">{secondary}</Table.TextCell>}
    </Table.Row>
  );
}

export default RowNumerosDeleted;
