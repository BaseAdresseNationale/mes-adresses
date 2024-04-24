import { useState, useContext, useCallback, useEffect } from "react";
import router from "next/router";
import { isEqual } from "lodash";
import { Pane, Button, Checkbox } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import DrawContext from "@/contexts/draw";
import TokenContext from "@/contexts/token";
import MapContext from "@/contexts/map";

import { useInput, useCheckboxInput } from "@/hooks/input";
import useValidationMessage from "@/hooks/validation-messages";
import useFocus from "@/hooks/focus";

import Form from "@/components/form";
import FormInput from "@/components/form-input";
import AssistedTextField from "@/components/assisted-text-field";
import DrawEditor from "@/components/bal/draw-editor";
import LanguesRegionalesForm from "@/components/langues-regionales-form";
import {
  BasesLocalesService,
  CreateVoieDTO,
  UpdateVoieDTO,
  Voie,
  VoiesService,
} from "@/lib/openapi";

interface VoieEditorProps {
  initialValue?: Voie;
  closeForm: () => void;
  formInputRef?: React.RefObject<HTMLDivElement>;
  onSubmitted?: () => void;
}

function VoieEditor({
  initialValue,
  closeForm,
  formInputRef,
  onSubmitted,
}: VoieEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMetric, onIsMetricChange] = useCheckboxInput(
    initialValue ? initialValue.typeNumerotation === "metrique" : false
  );
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : "");
  const { getValidationMessage, setValidationMessages } =
    useValidationMessage();
  const [nomAlt, setNomAlt] = useState(initialValue?.nomAlt);
  const { token } = useContext(TokenContext);
  const { baseLocale, refreshBALSync, reloadVoies, setVoie } =
    useContext(BalDataContext);
  const { drawEnabled, data, enableDraw, disableDraw } =
    useContext(DrawContext);
  const { reloadTiles } = useContext(MapContext);
  const [ref, setIsFocus] = useFocus(true);

  const onFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setValidationMessages(null);
      setIsLoading(true);

      try {
        const body = {
          nom,
          nomAlt: Object.keys(nomAlt).length > 0 ? nomAlt : null,
          typeNumerotation: isMetric ? "metrique" : "numerique",
          trace: data ? data.geometry : null,
        };

        // Add or edit a voie
        const submit = initialValue
          ? async () =>
              VoiesService.updateVoie(initialValue._id, body as UpdateVoieDTO)
          : async () =>
              BasesLocalesService.createVoie(
                baseLocale._id,
                body as CreateVoieDTO
              );

        const voie = await submit();

        refreshBALSync();

        if (initialValue?._id === voie._id && router.query.idVoie) {
          setVoie(voie);
          // Reload voie trace
          if (
            !isEqual(initialValue.trace, data?.geometry) ||
            body.typeNumerotation !== initialValue.typeNumerotation
          ) {
            reloadTiles();
          }
        } else {
          reloadTiles();
        }

        await reloadVoies();

        if (onSubmitted) {
          onSubmitted();
        }

        setIsLoading(false);
        closeForm();
      } catch (err) {
        if (err.status === 400) {
          setValidationMessages(err.body.message);
        }
        setIsLoading(false);
      }
    },
    [
      baseLocale._id,
      initialValue,
      nom,
      isMetric,
      data,
      nomAlt,
      closeForm,
      setValidationMessages,
      setVoie,
      reloadVoies,
      refreshBALSync,
      reloadTiles,
      onSubmitted,
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
  }, [nom, setValidationMessages]);

  useEffect(() => {
    if (isMetric) {
      enableDraw(initialValue);
    } else if (!isMetric && drawEnabled) {
      disableDraw();
    }
  }, [initialValue, disableDraw, drawEnabled, enableDraw, isMetric]);

  useEffect(() => {
    onNomChange({ target: { value: initialValue?.nom } });
  }, [initialValue?.nom, onNomChange]);

  const onUnmount = useCallback(() => {
    disableDraw();
  }, [disableDraw]);

  return (
    <Form
      editingId={initialValue?._id}
      unmountForm={onUnmount}
      closeForm={closeForm}
      onFormSubmit={onFormSubmit}
    >
      <Pane>
        <FormInput ref={formInputRef}>
          <AssistedTextField
            forwadedRef={ref}
            exitFocus={() => setIsFocus(false)}
            label="Nom de la voie"
            placeholder="Nom de la voie"
            value={nom}
            onChange={onNomChange}
            validationMessage={getValidationMessage("nom")}
          />

          <Checkbox
            checked={isMetric}
            label="Cette voie utilise la numérotation métrique"
            onChange={onIsMetricChange}
            marginBottom="1em"
          />

          <LanguesRegionalesForm
            initialValue={initialValue?.nomAlt}
            validationMessage={getValidationMessage("lang_alt")}
            handleLanguages={setNomAlt}
          />
        </FormInput>

        {isMetric && <DrawEditor />}
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

export default VoieEditor;
