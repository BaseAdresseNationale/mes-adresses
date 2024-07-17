import { useState, useMemo, useContext, useCallback, useEffect } from "react";
import { xor } from "lodash";
import { Pane, Button } from "evergreen-ui";
import router from "next/router";

import BalDataContext from "@/contexts/bal-data";
import MarkersContext from "@/contexts/markers";
import ParcellesContext from "@/contexts/parcelles";

import { useInput } from "@/hooks/input";
import useFocus from "@/hooks/focus";
import useValidationMessage from "@/hooks/validation-messages";

import Form from "@/components/form";
import AssistedTextField from "@/components/assisted-text-field";
import FormInput from "@/components/form-input";
import PositionEditor from "@/components/bal/position-editor";
import SelectParcelles from "@/components/bal/numero-editor/select-parcelles";
import DisabledFormInput from "@/components/disabled-form-input";
import LanguesRegionalesForm from "@/components/langues-regionales-form";
import { BasesLocalesService, Toponyme, ToponymesService } from "@/lib/openapi";
import { CommuneType } from "@/types/commune";
import LayoutContext from "@/contexts/layout";

interface ToponymeEditorProps {
  initialValue?: Toponyme;
  commune: CommuneType;
  refs?: { [key: string]: React.RefObject<HTMLDivElement> };
  closeForm: () => void;
  onSubmitted?: () => Promise<void>;
}

function ToponymeEditor({
  initialValue,
  commune,
  closeForm,
  refs,
  onSubmitted,
}: ToponymeEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [nom, onNomChange, resetNom] = useInput(initialValue?.nom || "");
  const { getValidationMessage, setValidationMessages } =
    useValidationMessage();
  const { toaster } = useContext(LayoutContext);
  const [nomAlt, setNomAlt] = useState(initialValue?.nomAlt);

  const {
    baseLocale,
    setToponyme,
    reloadToponymes,
    refreshBALSync,
    reloadParcelles,
  } = useContext(BalDataContext);
  const { markers } = useContext(MarkersContext);
  const { selectedParcelles } = useContext(ParcellesContext);
  const [ref, setIsFocus] = useFocus(true);

  const onFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setValidationMessages(null);
      setIsLoading(true);

      const body = {
        nom,
        nomAlt: Object.keys(nomAlt).length > 0 ? nomAlt : null,
        positions: [],
        parcelles: selectedParcelles,
      };

      if (markers) {
        markers.forEach((marker) => {
          body.positions.push({
            point: {
              type: "Point",
              coordinates: [marker.longitude, marker.latitude],
            },
            type: marker.type,
          });
        });
      }

      try {
        // Add or edit a toponyme
        const submit = initialValue
          ? toaster(
              () => ToponymesService.updateToponyme(initialValue.id, body),
              "Le toponyme a bien été modifé",
              "Le toponyme n’a pas pu être modifié",
              (error) => {
                setValidationMessages(error.body.message);
              }
            )
          : toaster(
              () => BasesLocalesService.createToponyme(baseLocale.id, body),
              "Le toponyme a bien été ajouté",
              "Le toponyme n’a pas pu être ajouté",
              (error) => {
                setValidationMessages(error.body.message);
              }
            );

        const toponyme = await submit();

        refreshBALSync();

        if (initialValue?.id === toponyme.id && router.query.idToponyme) {
          setToponyme(toponyme);
        }

        await reloadToponymes();

        if (xor(initialValue?.parcelles, body.parcelles).length > 0) {
          await reloadParcelles();
        }

        if (onSubmitted) {
          await onSubmitted();
        }

        closeForm();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      baseLocale.id,
      initialValue,
      nom,
      nomAlt,
      markers,
      selectedParcelles,
      setToponyme,
      closeForm,
      refreshBALSync,
      reloadToponymes,
      reloadParcelles,
      setValidationMessages,
      onSubmitted,
      toaster,
    ]
  );

  const onFormCancel = useCallback(
    (e) => {
      e.preventDefault();
      closeForm();
    },
    [closeForm]
  );

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return "En cours…";
    }

    return "Enregistrer";
  }, [isLoading]);

  useEffect(() => {
    const { nom } = initialValue || {};
    resetNom(nom || "");
    setValidationMessages(null);
  }, [resetNom, setValidationMessages, initialValue]);

  return (
    <Form
      editingId={initialValue?.id}
      closeForm={closeForm}
      onFormSubmit={onFormSubmit}
    >
      <Pane>
        <FormInput ref={refs?.nom}>
          <AssistedTextField
            forwadedRef={ref}
            exitFocus={() => setIsFocus(false)}
            isDisabled={isLoading}
            label="Nom du toponyme"
            placeholder="Nom du toponyme"
            value={nom}
            onChange={onNomChange}
            validationMessage={getValidationMessage("nom")}
          />

          <LanguesRegionalesForm
            initialValue={initialValue?.nomAlt}
            validationMessage={getValidationMessage("lang_alt")}
            handleLanguages={setNomAlt}
          />
        </FormInput>

        <FormInput ref={refs?.positions}>
          <PositionEditor
            initialPositions={initialValue?.positions}
            isToponyme
            validationMessage={getValidationMessage("positions")}
          />
        </FormInput>

        {commune.hasCadastre ? (
          <FormInput ref={refs?.parcelles}>
            <SelectParcelles
              initialParcelles={initialValue?.parcelles}
              isToponyme
            />
          </FormInput>
        ) : (
          <DisabledFormInput label="Parcelles" />
        )}
      </Pane>

      <div className="toponyme-editor-controls">
        <Button
          isLoading={isLoading}
          type="submit"
          appearance="primary"
          intent="success"
          boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
        >
          {submitLabel}
        </Button>

        <Button
          disabled={isLoading}
          appearance="default"
          marginLeft={8}
          display="inline-flex"
          onClick={onFormCancel}
          boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
        >
          Annuler
        </Button>
      </div>

      <style jsx>{`
        .toponyme-editor-controls {
          position: sticky;
          bottom: 0;
          display: flex;
          padding: 10px;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Form>
  );
}

export default ToponymeEditor;
