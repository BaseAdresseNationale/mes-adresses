import { CommuneType } from "@/types/commune";
import { Pane, Select } from "evergreen-ui";

interface SelectCommuneProps {
  communes: {
    code: string;
    nom: string;
  }[];
  selectedCodeCommune: string;
  setSelectedCodeCommune: (code: string) => void;
}

function SelectCommune({
  communes,
  selectedCodeCommune,
  setSelectedCodeCommune,
}: SelectCommuneProps) {
  return (
    <Pane marginTop={8}>
      <Select
        value={selectedCodeCommune}
        onChange={(event) => setSelectedCodeCommune(event.target.value)}
      >
        {communes.map(({ code, nom }) => (
          <option key={code} value={code}>
            {nom} ({code})
          </option>
        ))}
      </Select>
    </Pane>
  );
}

export default SelectCommune;
