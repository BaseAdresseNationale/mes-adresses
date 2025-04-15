import { Pane, SelectField } from "evergreen-ui";

interface SelectCommuneAncienneProps {
  communes: string[];
  selectedCodeCommune: string;
  setSelectedCodeCommune: (code: string) => void;
  withOptionNull?: boolean;
  label?: string;
}

function SelectCommuneAncienne({
  communes,
  selectedCodeCommune,
  setSelectedCodeCommune,
  withOptionNull = false,
  label = null,
}: SelectCommuneAncienneProps) {
  return (
    <Pane marginTop={8}>
      <SelectField
        label={label}
        value={selectedCodeCommune}
        onChange={(event) => setSelectedCodeCommune(event.target.value)}
        marginBottom={0}
      >
        {withOptionNull && <option key="null" value={null}></option>}
        {communes.map((commune) => (
          <option key={commune} value={commune}>
            {commune}
          </option>
        ))}
      </SelectField>
    </Pane>
  );
}

export default SelectCommuneAncienne;
