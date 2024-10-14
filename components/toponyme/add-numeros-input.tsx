import { useState, Dispatch, SetStateAction } from "react";
import { Pane, Button, Text } from "evergreen-ui";

import AddNumerosWithVoie from "./add-numeros-with-voie";
import AddNumerosWithPolygon from "./add-numeros-with-polygon";

interface AddNumerosProps {
  numerosIds: string[];
  setNumerosIds: Dispatch<SetStateAction<string[]>>;
  isLoading?: boolean;
}

function AddNumerosInput({ numerosIds, setNumerosIds }: AddNumerosProps) {
  const [typeSelection, setTypeSelection] = useState<"voie" | "polygon">(null);

  return (
    <Pane>
      <Pane marginBottom="8px">
        <Pane marginBottom="8px">
          <Text marginBottom="8px">Ajouter des numéros avec</Text>
        </Pane>
        <Pane display="flex" alignItems="center" justifyContent="space-between">
          <Button
            marginTop={0}
            type="button"
            onClick={() => setTypeSelection("voie")}
          >
            Sélectionnez via voie
          </Button>
          <Text>ou</Text>
          <Button
            marginTop={0}
            type="button"
            onClick={() => setTypeSelection("polygon")}
          >
            Sélectionnez via polygon
          </Button>
        </Pane>
      </Pane>{" "}
      {typeSelection == "voie" && (
        <AddNumerosWithVoie
          numerosIds={numerosIds}
          setNumerosIds={setNumerosIds}
        />
      )}
      {typeSelection == "polygon" && (
        <AddNumerosWithPolygon
          numerosIds={numerosIds}
          setNumerosIds={setNumerosIds}
        />
      )}
    </Pane>
  );
}

export default AddNumerosInput;
