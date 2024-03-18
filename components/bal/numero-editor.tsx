import { useState, useCallback, useContext, useEffect } from "react";
import { xor, sortBy } from "lodash";
import { Pane, SelectField, TextInputField, toaster } from "evergreen-ui";

import { normalizeSort } from "@/lib/normalize";

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
import CertificationButton from "@/components/certification-button";
import PositionEditor from "@/components/bal/position-editor";
import SelectParcelles from "@/components/bal/numero-editor/select-parcelles";
import NumeroVoieSelector from "@/components/bal/numero-editor/numero-voie-selector";
import AddressPreview from "@/components/bal/address-preview";
import DisabledFormInput from "@/components/disabled-form-input";
import { BasesLocalesService, Numero, NumeroPopulate, NumerosService, VoiesService } from "@/lib/openapi";
import { CommuneType } from "@/types/commune";

const REMOVE_TOPONYME_LABEL = "Aucun toponyme";

interface NumeroEditorProps {
  commune: CommuneType;
  initialVoieId: string;
  initialValue?: Numero | NumeroPopulate;
  hasPreview?: boolean;
  closeForm?: () => void;
}

function NumeroEditor({
  commune,
  initialVoieId,
  initialValue = null,
  hasPreview = false,
  closeForm = null,
}: NumeroEditorProps) {
  const [voieId, setVoieId] = useState(initialVoieId);
  const [selectedNomToponyme, setSelectedNomToponyme] = useState("");
  const [toponymeId, setToponymeId] = useState(initialValue?.toponyme);
  const [isLoading, setIsLoading] = useState(false);
  const [certifie, setCertifie] = useState(initialValue?.certifie || false);
  const [numero, onNumeroChange] = useInput(initialValue?.numero.toString());
  const [nomVoie, onNomVoieChange] = useState("");
  const [selectedNomVoie, setSelectedNomVoie] = useState("");
  const [suffixe, onSuffixeChange] = useInput(initialValue?.suffixe);
  const [comment, onCommentChange] = useInput(initialValue?.comment);
  const {getValidationMessages, setValidationMessages} = useValidationMessage();

  const {
    baseLocale,
    voies,
    toponymes,
    reloadNumeros,
    reloadParcelles,
    refreshBALSync,
    reloadVoies,
  } = useContext(BalDataContext);
  const { selectedParcelles } = useContext(ParcellesContext);
  const { markers, suggestedNumero } = useContext(MarkersContext);
  const { reloadTiles } = useContext(MapContext);

  const [ref] = useFocus(true);

  const getOrCreateVoie = useCallback(async () => {
    if (nomVoie) {
      try {
        const newVoie = await BasesLocalesService.createVoie(baseLocale._id, { nom: nomVoie })
        setVoieId(newVoie._id)
        return newVoie
      } catch (error) {
        if (error.status === 400) {
          setValidationMessages(error.body.message);
        }
      }
    }

    return { _id: voieId };
  }, [baseLocale._id, nomVoie, voieId, setValidationMessages]);

  const getNumeroBody = useCallback(() => {
    const body = {
      toponyme: toponymeId,
      numero: Number(numero),
      suffixe: suffixe.length > 0 ? suffixe.toLowerCase().trim() : null,
      comment: comment.length > 0 ? comment : null,
      parcelles: selectedParcelles,
      certifie: certifie ?? (initialValue?.certifie || false),
    };

    if (markers.length > 0) {
      const positions = [];
      markers.forEach((marker) => {
        positions.push({
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
    selectedParcelles,
  ]);

  const onFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const body = getNumeroBody();
        const voie = await getOrCreateVoie();
  
        try {
          if (initialValue) {
            await NumerosService.updateNumero(initialValue._id, { voie: voie._id, ...body })
          } else {
            await VoiesService.createNumero(voie._id, body)
          }
        } catch (error) {
          if (error.status === 400) {
            setValidationMessages(error.body.message);
          }
        }

        toaster.success("Le numéro a bien été créé");

        await reloadNumeros();
        reloadTiles();
        if (xor(initialValue?.parcelles, body?.parcelles).length > 0) {
          await reloadParcelles();
        }

        if (initialVoieId !== voie._id) {
          reloadVoies();
        }

        setIsLoading(false);
        refreshBALSync();
        closeForm();
      } catch (error) {
        setIsLoading(false);
        toaster.danger("Le numéro n'a pas été créé", {
          description: error.message,
        });
      }
    },
    [
      getNumeroBody,
      getOrCreateVoie,
      closeForm,
      reloadNumeros,
      refreshBALSync,
      reloadParcelles,
      initialValue,
      setValidationMessages,
      reloadVoies,
      initialVoieId,
      reloadTiles,
    ]
  );

  useEffect(() => {
    if (suggestedNumero) {
      onNumeroChange({ target: { value: suggestedNumero } });
    }
  }, [suggestedNumero, onNumeroChange]);

  useEffect(() => {
    let nom = null;
    if (voieId) {
      nom = voies.find((voie) => voie._id === voieId).nom;
    }

    setSelectedNomVoie(nom);
  }, [voieId, voies]);

  useEffect(() => {
    let nom = null;
    if (toponymeId) {
      nom = toponymes.find((toponyme) => toponyme._id === toponymeId).nom;
    }

    setSelectedNomToponyme(nom);
  }, [toponymeId, toponymes]);

  return (
    <Form
      editingId={initialValue?._id}
      closeForm={closeForm}
      onFormSubmit={onFormSubmit}
    >
      {hasPreview && (
        <AddressPreview
          numero={numero}
          suffixe={suffixe}
          selectedNomToponyme={selectedNomToponyme}
          voie={nomVoie || selectedNomVoie}
          commune={commune}
        />
      )}

      <Pane paddingTop={hasPreview ? 36 : 0}>
        <FormInput>
          <NumeroVoieSelector
            voieId={voieId}
            voies={voies}
            nomVoie={nomVoie}
            mode={voieId ? "selection" : "creation"}
            validationMessage={getValidationMessages("nom")}
            handleVoie={setVoieId}
            handleNomVoie={onNomVoieChange}
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
                {initialValue?.toponyme
                  ? REMOVE_TOPONYME_LABEL
                  : "- Choisir un toponyme -"}
              </option>
              {sortBy(toponymes, (t) => normalizeSort(t.nom)).map(
                ({ _id, nom }) => (
                  <option key={_id} value={_id}>
                    {nom}
                  </option>
                )
              )}
            </SelectField>
          </FormInput>
        </Pane>

        <FormInput>
          <Pane display="flex" alignItems="flex-start">
            <TextInputField
              ref={ref}
              required
              label="Numéro"
              display="block"
              type="number"
              disabled={isLoading}
              width="100%"
              maxWidth={300}
              flex={2}
              min={0}
              max={9999}
              value={numero}
              marginBottom={0}
              onWheel={(e) => e.target.blur()}
              placeholder="Numéro"
              onChange={onNumeroChange}
              validationMessage={getValidationMessages("numero")}
            />

            <TextInputField
              label=""
              style={{ textTransform: "lowercase" }}
              display="block"
              marginTop={18}
              marginLeft={8}
              disabled={isLoading}
              width="100%"
              flex={1}
              minWidth={59}
              value={suffixe}
              marginBottom={0}
              placeholder="Suffixe"
              onChange={onSuffixeChange}
              validationMessage={getValidationMessages("suffixe")}
            />
          </Pane>
        </FormInput>

        <FormInput>
          <PositionEditor
            initialPositions={initialValue?.positions}
            validationMessage={getValidationMessages("positions")}
          />
        </FormInput>

        {commune.hasCadastre ? (
          <FormInput>
            <SelectParcelles initialParcelles={initialValue?.parcelles} />
          </FormInput>
        ) : (
          <DisabledFormInput label="Parcelles" />
        )}

        <Comment input={comment} onChange={onCommentChange} />
      </Pane>

      <CertificationButton
        isCertified={initialValue?.certifie || false}
        isLoading={isLoading}
        onConfirm={setCertifie}
        onCancel={closeForm}
      />
    </Form>
  );
}

export default NumeroEditor;
