import { useState, useCallback, useContext, useMemo } from "react";
import { sortBy } from "lodash";
import { SelectField, SelectMenu, Pane, Button, Text } from "evergreen-ui";

import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";

import Form from "@/components/form";
import FormInput from "@/components/form-input";
import { Numero, VoiesService } from "@/lib/openapi";
import AddNumerosWithVoie from "./add-numeros-with-voie";
import AddNumerosWithPolygon from "./add-numeros-with-polygon";

interface AddNumerosProps {
  onSubmit: (numeros: string[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function AddNumeros({ onSubmit, onCancel, isLoading }: AddNumerosProps) {
  const [typeSelection, setTypeSelection] = useState<"voie" | "polygon">(null);
  const [numerosIds, setNumerosIds] = useState<string[]>([]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await onSubmit(numerosIds);
    },
    [numerosIds, onSubmit]
  );

  return (
    <Pane>
      <Pane backgroundColor="white" padding="8px">
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
      </Pane>
      <Form onFormSubmit={handleSubmit}>
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
        <Pane display="flex" justifyContent="end">
          <Button
            isLoading={isLoading}
            type="submit"
            appearance="primary"
            intent="success"
            disabled={numerosIds.length <= 0}
          >
            {isLoading ? "Enregistrement…" : "Enregistrer"}
          </Button>

          <Button disabled={isLoading} marginLeft={8} onClick={onCancel}>
            Annuler
          </Button>
        </Pane>
      </Form>
    </Pane>
  );
}

export default AddNumeros;
