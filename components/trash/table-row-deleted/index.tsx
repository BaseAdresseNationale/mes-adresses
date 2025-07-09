import { Pane, Table, Text } from "evergreen-ui";

import TableRowDeleteActions from "@/components/trash/table-row-deleted/table-row-action-deleted";
import LanguagePreview from "@/components/bal/language-preview";

interface TableRowProps {
  label: string;
  nomAlt: Record<string, string>;
  isDeleted: boolean;
  complement: string;
  actions: { label: string; icon: any; callback: () => void; intent: string }[];
}

function TableRow({
  label,
  nomAlt,
  isDeleted = true,
  complement,
  actions,
}: TableRowProps) {
  return (
    <Table.Row paddingRight={8} minHeight={48}>
      <Table.Cell>
        <Table.TextCell data-editable flex="0 1 1" height="100%">
          <Pane padding={1} fontSize={15}>
            <Text color={isDeleted ? "danger" : "default"}>{label}</Text>
            {complement && (
              <Text>
                <i>{` - ${complement}`}</i>
              </Text>
            )}
          </Pane>

          {nomAlt && (
            <Pane marginTop={4}>
              <LanguagePreview nomsAlt={nomAlt} />
            </Pane>
          )}
        </Table.TextCell>
      </Table.Cell>

      {actions && <TableRowDeleteActions actions={actions} />}
    </Table.Row>
  );
}

export default TableRow;
