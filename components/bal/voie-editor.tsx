import {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  Pane,
  Button,
  RadioGroup,
  Alert,
  Text,
  UnorderedList,
  ListItem,
  defaultTheme,
} from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import DrawContext from "@/contexts/draw";
import MapContext from "@/contexts/map";

import { useInput } from "@/hooks/input";
import useValidationMessage from "@/hooks/validation-messages";
import useFocus from "@/hooks/focus";

import Form from "@/components/form";
import FormInput from "@/components/form-input";
import AssistedTextField from "@/components/assisted-text-field";
import LanguesRegionalesForm from "@/components/langues-regionales-form";
import {
  BasesLocalesService,
  CreateVoieDTO,
  UpdateVoieDTO,
  Voie,
  VoiesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import Comment from "../comment";
import { trimNomAlt } from "@/lib/utils/string";
import { DrawMetricVoieEditor } from "./draw-metric-voie-editor";
import AlertsContext from "@/contexts/alerts";
import {
  AlertFieldVoieEnum,
  AlertVoie,
  AlertModelEnum,
  AlertCodeEnum,
} from "@/lib/alerts/alerts.types";
import { AlertVoieDefinitions } from "@/lib/alerts/alerts.definitions";
import { computeVoieNomAlerts } from "@/lib/alerts/utils/fields/voie-nom.utils";
import { isAlertVoieNom } from "@/lib/alerts/utils/alerts-voies.utils";
import styles from "./voie-editor.module.css";
import AlertEditor from "./alert-editor";

interface VoieEditorProps {
  initialValue?: Voie;
  formInputRef?: React.RefObject<HTMLDivElement>;
  onSubmit: (idVoie: string) => void;
  onClose: () => void;
}

const options = [
  { label: "Numérique", value: Voie.typeNumerotation.NUMERIQUE },
  { label: "Métrique", value: Voie.typeNumerotation.METRIQUE },
];

function VoieEditor({
  initialValue,
  onClose,
  formInputRef,
  onSubmit,
}: VoieEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [typeNumerotation, setTypeNumerotation] = useState(
    initialValue?.typeNumerotation || Voie.typeNumerotation.NUMERIQUE,
  );
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : "");
  const [comment, onCommentChange] = useInput(
    initialValue ? initialValue.comment : "",
  );
  const { getValidationMessage, setValidationMessages } =
    useValidationMessage();
  const [nomAlt, setNomAlt] = useState(initialValue?.nomAlt);
  const { baseLocale, refreshBALSync, reloadVoies, setVoie, voies } =
    useContext(BalDataContext);
  const { data } = useContext(DrawContext);
  const { reloadTiles } = useContext(MapContext);
  const { toaster } = useContext(LayoutContext);
  const [ref, setIsFocus] = useFocus(true);
  const { reloadVoieAlerts } = useContext(AlertsContext);

  const onFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setValidationMessages(null);
      setIsLoading(true);

      try {
        const body = {
          nom: nom.trim(),
          nomAlt: Object.keys(nomAlt).length > 0 ? trimNomAlt(nomAlt) : null,
          typeNumerotation,
          trace: data ? data.geometry : null,
          comment: comment ? comment : null,
        };
        // Add or edit a voie
        const submit = initialValue
          ? toaster(
              async () =>
                VoiesService.updateVoie(initialValue.id, body as UpdateVoieDTO),
              "La voie a bien été modifiée",
              "La voie n’a pas pu être modifiée",
              (err) => {
                setValidationMessages(err.body.message);
              },
            )
          : toaster(
              async () =>
                BasesLocalesService.createVoie(
                  baseLocale.id,
                  body as CreateVoieDTO,
                ),
              "La voie a bien été ajoutée",
              "La voie n’a pas pu être ajoutée",
              (err) => {
                setValidationMessages(err.body.message);
              },
            );

        const { id: voieId } = await submit();

        refreshBALSync();
        await reloadVoies();
        reloadTiles();
        // LOAD ALERTS
        const voie = voies.find(({ id }) => id === voieId);
        if (voie) {
          await reloadVoieAlerts(
            voie,
            (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || [],
          );
        }

        if (initialValue?.id === voie.id) {
          setVoie(voie);
        }

        onSubmit(voie.id);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      setValidationMessages,
      nom,
      nomAlt,
      typeNumerotation,
      data,
      comment,
      initialValue,
      toaster,
      refreshBALSync,
      reloadVoies,
      reloadTiles,
      reloadVoieAlerts,
      baseLocale.settings?.ignoredAlertCodes,
      baseLocale.id,
      onSubmit,
      setVoie,
    ],
  );

  const onFormCancel = useCallback(
    (e) => {
      e.preventDefault();

      onClose();
    },
    [onClose],
  );

  // Reset validation messages on changes
  useEffect(() => {
    setValidationMessages(null);
  }, [nom]);

  return (
    <Form
      editingId={initialValue?.id}
      closeForm={onClose}
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
            validationMessage={getValidationMessage("voie_nom")}
          />
          <AlertEditor
            value={nom}
            setValue={onNomChange}
            validation={computeVoieNomAlerts}
            model={AlertModelEnum.VOIE}
            field={AlertFieldVoieEnum.VOIE_NOM}
          />
          <RadioGroup
            isRequired
            className={styles["custom-radio-group"]}
            marginTop="1em"
            label="Type de numérotation *"
            value={typeNumerotation}
            options={options}
            onChange={(event) =>
              setTypeNumerotation(event.target.value as Voie.typeNumerotation)
            }
          />

          <LanguesRegionalesForm
            initialValue={initialValue?.nomAlt}
            validationMessage={getValidationMessage("lang_alt")}
            handleLanguages={setNomAlt}
          />
        </FormInput>

        <Comment
          input={comment}
          onChange={onCommentChange}
          validationMessage={getValidationMessage("comment")}
        />

        {typeNumerotation === Voie.typeNumerotation.METRIQUE && (
          <DrawMetricVoieEditor voie={initialValue} />
        )}
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

        {onClose && (
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
