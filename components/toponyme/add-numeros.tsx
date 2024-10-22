import { useState, useCallback } from "react";
import { Pane, Button, Text } from "evergreen-ui";

import Form from "@/components/form";
import AddNumerosWithVoie from "./add-numeros-with-voie";
import AddNumerosWithPolygon from "./add-numeros-with-polygon";
import AddNumerosInput from "./add-numeros-input";

interface AddNumerosProps {
  onSubmit: (numeros: string[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

function AddNumeros({ onSubmit, onCancel, isLoading }: AddNumerosProps) {
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
      <Form onFormSubmit={handleSubmit}>
        <Pane
          backgroundColor="white"
          padding={8}
          marginBottom={8}
          borderRadius={8}
        >
          <AddNumerosInput
            numerosIds={numerosIds}
            setNumerosIds={setNumerosIds}
          />
        </Pane>
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
