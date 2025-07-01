import { useState, useContext } from "react";
import { Pane, Heading, SelectField } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";

import NumeroEditor from "@/components/bal/numero-editor";
import ToponymeEditor from "@/components/bal/toponyme-editor";
import { CommuneType } from "@/types/commune";

interface AddressEditorProps {
  commune: CommuneType;
  closeForm: () => void;
}

function AddressEditor({ commune, closeForm }: AddressEditorProps) {
  const [isToponyme, setIsToponyme] = useState(false);

  const { voie } = useContext(BalDataContext);

  return (
    <Pane display="flex" flexDirection="column" height="100%">
      <Pane padding={12}>
        <Heading is="h4">Nouvelle adresse</Heading>
        <SelectField
          label="Créer un nouveau"
          value={isToponyme ? "toponyme" : "numero"}
          onChange={(e) => setIsToponyme(e.target.value === "toponyme")}
        >
          <option value="numero">Numéro</option>
          <option value="toponyme">Toponyme</option>
        </SelectField>
      </Pane>

      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {isToponyme ? (
          <ToponymeEditor commune={commune} closeForm={closeForm} />
        ) : (
          <NumeroEditor
            initialVoieId={voie?.id}
            commune={commune}
            closeForm={closeForm}
          />
        )}
      </Pane>
    </Pane>
  );
}

export default AddressEditor;
