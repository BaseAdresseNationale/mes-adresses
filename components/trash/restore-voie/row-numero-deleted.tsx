import { Table, Checkbox, Pane, Text } from "evergreen-ui";

import LanguagePreview from "@/components/bal/language-preview";

interface RowNumerosDeletedProps {
  label: string;
  nomAlt?: Record<string, string>;
  secondary?: string;
  isSelected: boolean;
  handleSelect: () => void;
}

function RowNumerosDeleted({
  label,
  nomAlt,
  secondary,
  isSelected,
  handleSelect,
}: RowNumerosDeletedProps) {
  return (
    <Table.Row paddingRight={8} minHeight={48}>
      {handleSelect && (
        <Table.Cell flex="0 1 1">
          <Checkbox checked={isSelected} onChange={handleSelect} />
        </Table.Cell>
      )}
      <Table.Cell>
        <Table.TextCell data-editable flex="0 1 1" height="100%">
          <Pane padding={1} fontSize={15}>
            <Text>{label}</Text>
          </Pane>

          {nomAlt && (
            <Pane marginTop={4}>
              <LanguagePreview nomAlt={nomAlt} />
            </Pane>
          )}
        </Table.TextCell>
      </Table.Cell>

      {secondary && <Table.TextCell flex="0 1 1">{secondary}</Table.TextCell>}
    </Table.Row>
  );
}

export default RowNumerosDeleted;
