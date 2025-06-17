import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Pane,
  TextInputField,
  TextInput,
  IconButton,
  Button,
  Alert,
  Label,
  DeleteIcon,
  AddIcon,
  Checkbox,
  Heading,
} from "evergreen-ui";
import { isEqual, difference } from "lodash";

import { validateEmail } from "@/lib/utils/email";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import { useInput } from "@/hooks/input";

import FormContainer from "@/components/form-container";
import FormInput from "@/components/form-input";
import RenewTokenDialog from "@/components/renew-token-dialog";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import LocalStorageContext from "@/contexts/local-storage";

const mailHasChanged = (listA, listB) => {
  return !isEqual(
    [...listA].sort((a, b) => a.localeCompare(b)),
    [...listB].sort((a, b) => a.localeCompare(b))
  );
};

interface BALSettingsFormProps {
  baseLocale: BaseLocale;
}

const BALSettingsForm = React.memo(function BALSettingsForm({
  baseLocale,
}: BALSettingsFormProps) {
  const { reloadBaseLocale } = useContext(BalDataContext);

  const [isLoading, setIsLoading] = useState(false);
  const [nomInput, onNomInputChange] = useInput(baseLocale.nom);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState("");
  const { pushToast } = useContext(LayoutContext);

  const { userSettings, setUserSettings } = useContext(LocalStorageContext);
  const [userSettingsForm, setUserSettingsForm] = useState(userSettings);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hasChanged = () =>
    JSON.stringify(userSettingsForm) !== JSON.stringify(userSettings) ||
    nomInput !== baseLocale.nom;

  const onSubmitNomBaseLocale = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    await BasesLocalesService.updateBaseLocale(baseLocale.id, {
      nom: nomInput.trim(),
    });
    reloadBaseLocale();
    setIsLoading(false);
  }, [baseLocale.id, nomInput, reloadBaseLocale]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        if (nomInput !== baseLocale.nom) {
          await onSubmitNomBaseLocale();
        }
        if (userSettingsForm !== userSettings) {
          setUserSettings(userSettingsForm);
        }
        pushToast({
          title:
            "Les préférences utilisateurs ont été enregistrées avec succès",
          intent: "success",
        });
      } catch (error) {
        setError(error.body?.message);
      }
    },
    [
      nomInput,
      baseLocale.nom,
      userSettingsForm,
      userSettings,
      pushToast,
      onSubmitNomBaseLocale,
      setUserSettings,
    ]
  );

  useEffect(() => {
    setHasChanges(hasChanged());
  }, [hasChanged]);

  return (
    <FormContainer onSubmit={onSubmit} display="flex" flexDirection="column">
      <Pane>
        <FormInput>
          <Heading is="h4">Paramètres de la Base Adresse Locale</Heading>
          <TextInputField
            required
            name="nom"
            id="nom"
            value={nomInput}
            maxWidth={600}
            marginBottom={0}
            marginTop={16}
            disabled={isLoading || baseLocale.status === "demo"}
            label="Nom"
            placeholder="Nom"
            onChange={onNomInputChange}
          />
        </FormInput>

        {error && (
          <Alert marginBottom={16} intent="danger" title="Erreur">
            {error}
          </Alert>
        )}
      </Pane>

      <Pane>
        <FormInput>
          <Heading is="h4">Préférences utilisateurs</Heading>
          <Checkbox
            name="colorblind-mode"
            id="colorblind-mode"
            label="Activer le mode daltonien"
            checked={userSettingsForm?.colorblindMode}
            onChange={() =>
              setUserSettingsForm((settings) => ({
                ...settings,
                colorblindMode: !settings?.colorblindMode,
              }))
            }
          />
        </FormInput>
      </Pane>

      <Button
        height={40}
        marginTop={8}
        type="submit"
        appearance="primary"
        disabled={!hasChanges}
        isLoading={isLoading}
        width="fit-content"
      >
        {isLoading ? "En cours…" : "Enregistrer les changements"}
      </Button>
    </FormContainer>
  );
});

export default BALSettingsForm;
