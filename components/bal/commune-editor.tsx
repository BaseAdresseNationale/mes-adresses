import { useState, useContext, useCallback, useEffect } from "react";
import { Pane, Button, Label } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";

import useValidationMessage from "@/hooks/validation-messages";

import Form from "@/components/form";
import FormInput from "@/components/form-input";
import LanguesRegionalesForm from "@/components/langues-regionales-form";
import {
  BaseLocale,
  BasesLocalesService,
  UpdateBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";

interface CommuneEditorProps {
  initialValue?: BaseLocale;
  closeForm: () => void;
  onSubmitted?: () => void;
}

function CommuneEditor({ initialValue, closeForm }: CommuneEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [nomAlt, setNomAlt] = useState(initialValue?.nomAlt);
  const { reloadBaseLocale } = useContext(BalDataContext);
  const { getValidationMessage, setValidationMessages } =
    useValidationMessage();
  const { toaster } = useContext(LayoutContext);

  const onFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setValidationMessages(null);
      setIsLoading(true);

      try {
        const body: UpdateBaseLocaleDTO = {
          nomAlt: Object.keys(nomAlt).length > 0 ? nomAlt : null,
        };
        // Add or edit a voie
        const submit = toaster(
          async () =>
            BasesLocalesService.updateBaseLocale(initialValue.id, body),
          "La bal a bien été modifiée",
          "La bal n’a pas pu être modifiée",
          (err) => {
            setValidationMessages(err.body.message);
          }
        );

        await submit();
        await reloadBaseLocale();
        closeForm();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      initialValue,
      nomAlt,
      closeForm,
      setValidationMessages,
      toaster,
      reloadBaseLocale,
    ]
  );

  const onFormCancel = useCallback(
    (e) => {
      e.preventDefault();
      closeForm();
    },
    [closeForm]
  );

  // Reset validation messages on changes
  useEffect(() => {
    setValidationMessages(null);
  }, [nomAlt, setValidationMessages]);

  return (
    <Form
      editingId={initialValue?.id}
      closeForm={closeForm}
      onFormSubmit={onFormSubmit}
    >
      <Pane>
        <FormInput>
          <Label>Nom régionale de la commune</Label>
          <LanguesRegionalesForm
            initialValue={initialValue?.nomAlt}
            validationMessage={getValidationMessage("langAlt")}
            handleLanguages={setNomAlt}
            autoOpen={true}
          />
        </FormInput>
      </Pane>

      <Pane>
        <Button
          isLoading={isLoading}
          type="submit"
          appearance="primary"
          intent="success"
        >
          {isLoading ? "En cours…" : "Enregistrer"}
        </Button>

        {closeForm && (
          <Button
            disabled={isLoading}
            appearance="minimal"
            marginLeft={8}
            display="inline-flex"
            onClick={onFormCancel}
          >
            Annuler
          </Button>
        )}
      </Pane>
    </Form>
  );
}

export default CommuneEditor;
