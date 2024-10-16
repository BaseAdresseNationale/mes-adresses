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
          <Text marginBottom="8px">Associer des numéros</Text>
        </Pane>
        <Pane display="flex" alignItems="center" justifyContent="space-between">
          <Button
            marginTop={0}
            type="button"
            onClick={() => setTypeSelection("voie")}
          >
            Avec une voie
          </Button>
          <Text>ou</Text>
          <Button
            marginTop={0}
            type="button"
            onClick={() => setTypeSelection("polygon")}
          >
            En dessinant le contour
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
