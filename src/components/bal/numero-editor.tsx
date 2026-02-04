import React, { useState, useCallback, useContext, useEffect } from "react";
import { xor, sortBy } from "lodash";
import { Pane, SelectField, TextInputField } from "evergreen-ui";

import { normalizeSort } from "@/lib/normalize";
import { computeCompletNumero } from "@/lib/utils/numero";

import MarkersContext from "@/contexts/markers";
import BalDataContext from "@/contexts/bal-data";
import ParcellesContext from "@/contexts/parcelles";

import { useInput } from "@/hooks/input";
import useFocus from "@/hooks/focus";
import useValidationMessage from "@/hooks/validation-messages";
import MapContext from "@/contexts/map";

import Comment from "@/components/comment";
import Form from "@/components/form";
import FormInput from "@/components/form-input";
import CertificationButton, {
  CertificationButtonProps,
} from "@/components/certification-button";
import PositionEditor from "@/components/bal/position-editor";
import SelectParcelles from "@/components/bal/numero-editor/select-parcelles";
import NumeroVoieSelector from "@/components/bal/numero-editor/numero-voie-selector";
import AddressPreview from "@/components/bal/address-preview";
import DisabledFormInput from "@/components/disabled-form-input";
import {
  BasesLocalesService,
  Numero,
  NumerosService,
  VoiesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import SelectCommune from "../select-commune";
import { CommuneType } from "@/types/commune";
import DrawContext from "@/contexts/draw";
import AlertsContext from "@/contexts/alerts";
import {
  AlertCodeEnum,
  AlertFieldNumeroEnum,
  AlertModelEnum,
} from "@/lib/alerts/alerts.types";
import { computeNumeroSuffixeAlerts } from "@/lib/alerts/utils/fields/numero-suffixe.utils";
import AlertEditor from "./alert-editor";

const REMOVE_TOPONYME_LABEL = "Aucun toponyme";

interface NumeroEditorProps {
  initialVoieId?: string;
  initialValue?: Numero;
  commune: CommuneType;
  closeForm: () => void;
  onSubmitted?: () => void;
  refs?: { [key: string]: React.RefObject<HTMLDivElement> };
  certificationBtnProps?: Partial<CertificationButtonProps>;
  onVoieChanged?: () => void;
}

function NumeroEditor({
  initialVoieId,
  initialValue,
  commune,
  closeForm,
  onSubmitted,
  refs,
  certificationBtnProps,
  onVoieChanged,
}: NumeroEditorProps) {
  const [voieId, setVoieId] = useState(initialVoieId || initialValue?.voieId);
  const [selectedNomToponyme, setSelectedNomToponyme] = useState("");
  const [toponymeId, setToponymeId] = useState(initialValue?.toponymeId);
  const [isLoading, setIsLoading] = useState(false);
  const [certifie, setCertifie] = useState(initialValue?.certifie || false);
  const [numero, onNumeroChange] = useInput(
    initialValue?.numero.toString() || ""
  );
  const [numeroWasEdited, setNumeroWasEdited] = useState<boolean>(false);
  const [nomVoie, onNomVoieChange] = useState("");
  const [communeDeleguee, setCommuneDeleguee] = useState(
    initialValue?.communeDeleguee || null
  );
  const [selectedNomVoie, setSelectedNomVoie] = useState("");
  const [suffixe, onSuffixeChange] = useInput(initialValue?.suffixe || "");
  const [comment, onCommentChange] = useInput(initialValue?.comment || "");
  const { toaster } = useContext(LayoutContext);
  const { getValidationMessage, setValidationMessages } =
    useValidationMessage();

  const {
    baseLocale,
    voies,
    toponymes,
    reloadNumeros,
    reloadParcelles,
    refreshBALSync,
    reloadVoies,
  } = useContext(BalDataContext);
  const { highlightedParcelles } = useContext(ParcellesContext);
  const { markers, suggestedNumero, setCompleteNumero } =
    useContext(MarkersContext);
  const { setHint } = useContext(DrawContext);
  const { reloadTiles } = useContext(MapContext);
  const { reloadNumerosAlerts, reloadVoieAlerts } = useContext(AlertsContext);

  const [ref] = useFocus(true);

  const getEditedVoie = useCallback(async () => {
    if (nomVoie) {
      try {
        const newVoie = await BasesLocalesService.createVoie(baseLocale.id, {
          nom: nomVoie.trim(),
        });
        return newVoie;
      } catch (err) {
        if (err.status === 400) {
          setValidationMessages(err.body.message);
        }
        throw err;
      }
    }

    return { id: voieId };
  }, [baseLocale.id, nomVoie, voieId, setValidationMessages]);

  const getNumeroBody = useCallback(() => {
    const body = {
      toponymeId,
      numero: Number(numero),
      suffixe: suffixe?.length > 0 ? suffixe.toLowerCase().trim() : null,
      comment: comment.length > 0 ? comment : null,
      parcelles: highlightedParcelles,
      certifie: certifie ?? (initialValue?.certifie || false),
      communeDeleguee: communeDeleguee,
    };

    if (markers.length > 0) {
      const positions = [];
      markers.forEach((marker) => {
        positions.push({
          id: marker.id,
          point: {
            type: "Point",
            coordinates: [marker.longitude, marker.latitude],
          },
          type: marker.type,
        });
      });

      return { ...body, positions };
    }
  }, [
    initialValue,
    numero,
    suffixe,
    markers,
    certifie,
    toponymeId,
    comment,
    communeDeleguee,
    highlightedParcelles,
  ]);

  const onFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setIsLoading(true);

      if (parseInt(numero) === 99999) {
        setValidationMessages([
          "numero:Le numero 99999 est réservé au lieu-dit et complément",
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const body = getNumeroBody();

        const voie = await getEditedVoie();

        if (initialValue?.id) {
          const updateNumero = toaster(
            () =>
              NumerosService.updateNumero(initialValue.id, {
                voieId: voie.id,
                ...body,
              }),
            "Le numéro a bien été modifié",
            "Le numéro n’a pas pu être modifié",
            (err) => {
              setValidationMessages(err.body.message);
            }
          );
          await updateNumero();
        } else {
          const createNumero = toaster(
            () => VoiesService.createNumero(voie.id, body),
            "Le numéro a bien été ajouté",
            "Le numéro n’a pas pu être ajouté",
            (err) => {
              setValidationMessages(err.body.message);
            }
          );
          await createNumero();
        }

        await reloadNumeros();

        reloadTiles();
        if (xor(initialValue?.parcelles, body?.parcelles).length > 0) {
          await reloadParcelles();
        }

        const newVoies = await reloadVoies();

        // RELOAD ALERTS
        await reloadNumerosAlerts(
          baseLocale.id,
          (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
        );
        await reloadVoieAlerts(
          newVoies.find(({ id }) => id === voie.id),
          (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || []
        );

        if (onSubmitted) {
          onSubmitted();
        }

        refreshBALSync();
        closeForm();
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [
      getNumeroBody,
      getEditedVoie,
      closeForm,
      reloadNumeros,
      refreshBALSync,
      reloadParcelles,
      initialValue,
      setValidationMessages,
      reloadVoies,
      reloadTiles,
      onSubmitted,
      toaster,
      numero,
      baseLocale.id,
      reloadNumerosAlerts,
      reloadVoieAlerts,
      baseLocale.settings?.ignoredAlertCodes,
    ]
  );

  useEffect(() => {
    onNumeroChange({ target: { value: initialValue?.numero.toString() } });
    onSuffixeChange({ target: { value: initialValue?.suffixe } });
    setCompleteNumero(
      computeCompletNumero(initialValue?.numero, initialValue?.suffixe)
    );
  }, [
    initialValue?.numero,
    initialValue?.suffixe,
    onNumeroChange,
    onSuffixeChange,
    setCompleteNumero,
  ]);

  useEffect(() => {
    if (suggestedNumero && !numeroWasEdited && !initialValue) {
      onNumeroChange({ target: { value: suggestedNumero } });
      setCompleteNumero(computeCompletNumero(suggestedNumero, suffixe));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNumeroChange, setCompleteNumero, suggestedNumero, numeroWasEdited]);

  const handleChangeNumero = (event) => {
    setNumeroWasEdited(true);
    onNumeroChange(event);
    const value: string = event.target.value;
    setCompleteNumero(computeCompletNumero(value, suffixe));
  };

  const handleChangeSuffixe = (event) => {
    onSuffixeChange(event);
    const value: string = event.target.value;
    setCompleteNumero(computeCompletNumero(numero, value));
  };

  const handleVoieIdChange = useCallback((voieId) => {
    setVoieId(voieId);
    if (onVoieChanged) {
      onVoieChanged();
    }
  }, []);

  const handleNomVoieChange = useCallback((nomVoie) => {
    onNomVoieChange(nomVoie);
    if (onVoieChanged) {
      onVoieChanged();
    }
  }, []);

  useEffect(() => {
    let nom = null;
    if (voieId) {
      nom = voies.find((voie) => voie.id === voieId).nom;
    }

    setSelectedNomVoie(nom);
  }, [voieId, voies]);

  useEffect(() => {
    let nom = null;
    if (toponymeId) {
      nom = toponymes.find((toponyme) => toponyme.id === toponymeId).nom;
    }

    setSelectedNomToponyme(nom);
  }, [toponymeId, toponymes]);

  useEffect(() => {
    if (markers.length > 1) {
      setHint(
        "Déplacez les marqueurs sur la carte pour modifier les positions"
      );
    } else {
      setHint("Déplacez le marqueur sur la carte pour positionner le numéro");
    }

    return () => {
      setHint(null);
    };
  }, [markers, setHint]);

  return (
    <Form
      editingId={initialValue?.id}
      closeForm={closeForm}
      onFormSubmit={onFormSubmit}
    >
      <AddressPreview
        numero={numero}
        suffixe={suffixe}
        selectedNomToponyme={selectedNomToponyme}
        voie={nomVoie || selectedNomVoie}
        commune={commune}
      />

      <Pane paddingTop={36}>
        <FormInput ref={refs?.voie}>
          <NumeroVoieSelector
            voieId={voieId}
            voies={voies}
            nomVoie={nomVoie}
            mode={voieId ? "selection" : "creation"}
            validationMessage={getValidationMessage("voie_nom")}
            handleVoie={handleVoieIdChange}
            handleNomVoie={handleNomVoieChange}
          />
        </FormInput>

        <Pane display="flex">
          <FormInput>
            <SelectField
              label="Toponyme"
              flex={1}
              marginBottom={0}
              value={toponymeId || ""}
              onChange={({ target }) => {
                setToponymeId(
                  target.value === REMOVE_TOPONYME_LABEL ||
                    target.value === "- Choisir un toponyme -"
                    ? null
                    : target.value
                );
              }}
            >
              <option value={null}>
                {initialValue?.toponymeId
                  ? REMOVE_TOPONYME_LABEL
                  : "- Choisir un toponyme -"}
              </option>
              {sortBy(toponymes, (t) => normalizeSort(t.nom)).map(
                ({ id, nom }) => (
                  <option key={id} value={id}>
                    {nom}
                  </option>
                )
              )}
            </SelectField>
          </FormInput>
        </Pane>

        {commune.communesDeleguees?.length > 0 && (
          <FormInput>
            <SelectCommune
              communes={commune.communesDeleguees}
              selectedCodeCommune={communeDeleguee}
              setSelectedCodeCommune={setCommuneDeleguee}
              withOptionNull={true}
              label="Commune déléguée"
            />
          </FormInput>
        )}

        <FormInput ref={refs?.numero}>
          <Pane display="flex" alignItems="flex-start" gap={8}>
            <TextInputField
              ref={ref}
              required
              label="Numéro"
              display="block"
              type="number"
              disabled={isLoading}
              width="50%"
              maxWidth={300}
              flex={2}
              value={numero}
              marginBottom={0}
              onWheel={(e) => e.target.blur()}
              placeholder={`Numéro${
                suggestedNumero ? ` recommandé : ${suggestedNumero}` : ""
              }`}
              onChange={handleChangeNumero}
              validationMessage={getValidationMessage("numero")}
            />

            <Pane width="50%">
              <TextInputField
                label=""
                style={{ textTransform: "lowercase" }}
                display="block"
                marginTop={18}
                disabled={isLoading}
                flex={1}
                value={suffixe}
                marginBottom={0}
                placeholder="Suffixe"
                onChange={handleChangeSuffixe}
                validationMessage={getValidationMessage("suffixe")}
              />
              <AlertEditor
                hasDefinition={false}
                value={suffixe}
                setValue={handleChangeSuffixe}
                validation={computeNumeroSuffixeAlerts}
                model={AlertModelEnum.NUMERO}
                field={AlertFieldNumeroEnum.NUMERO_SUFFIXE}
              />
            </Pane>
          </Pane>
        </FormInput>

        <FormInput ref={refs?.positions}>
          <PositionEditor
            initialPositions={initialValue?.positions}
            validationMessage={getValidationMessage("positions")}
          />
        </FormInput>

        {commune.hasCadastre ? (
          <FormInput ref={refs?.parcelles}>
            <SelectParcelles initialParcelles={initialValue?.parcelles || []} />
          </FormInput>
        ) : (
          <DisabledFormInput label="Parcelles" />
        )}

        <Comment
          input={comment}
          onChange={onCommentChange}
          validationMessage={getValidationMessage("comment")}
        />
      </Pane>

      <CertificationButton
        isCertified={initialValue?.certifie || false}
        isLoading={isLoading}
        onConfirm={setCertifie}
        onCancel={closeForm}
        {...certificationBtnProps}
      />
    </Form>
  );
}

export default NumeroEditor;
