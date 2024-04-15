import { Table } from "evergreen-ui";

import TableRowDeleteActions, {
  ActionProps,
} from "@/components/trash/table-row-deleted/table-row-action-deleted";
import TableRowEditShortcut from "@/components/table-row/table-row-edit-shortcut";

interface TableRowProps {
  label: string;
  nomAlt: Record<string, string>;
  isDeleted: boolean;
  complement: string;
  actions: ActionProps[];
}

function TableRow({
  label,
  nomAlt = null,
  isDeleted = true,
  complement = null,
  actions = [],
}: TableRowProps) {
  return (
    <Table.Row paddingRight={8} minHeight={48}>
      <TableRowEditShortcut
        label={label}
        nomAlt={nomAlt}
        complement={complement}
        colors={{
          label: isDeleted ? "danger" : "default",
        }}
      />

      {actions && <TableRowDeleteActions actions={actions} />}
    </Table.Row>
  );
}

export default TableRow;
