import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Pane,
  TextInputField,
  Button,
  Alert,
  Checkbox,
  Heading,
  MobilePhoneIcon,
  Text,
} from "evergreen-ui";
import BalDataContext from "@/contexts/bal-data";
import { useInput } from "@/hooks/input";
import FormContainer from "@/components/form-container";
import FormInput from "@/components/form-input";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import LocalStorageContext from "@/contexts/local-storage";
import ShareClipBoard from "./share/share-clipboard";
import ShareQRCode from "./share/share-qr-code";

const EDITEUR_URL =
  process.env.NEXT_PUBLIC_EDITEUR_URL || "https://mes-adresses.data.gouv.fr";

interface BALSettingsFormProps {
  baseLocale: BaseLocale;
  token?: string;
}

const BALSettingsForm = React.memo(function BALSettingsForm({
  baseLocale,
  token,
}: BALSettingsFormProps) {
  const { reloadBaseLocale } = useContext(BalDataContext);

  const [isLoading, setIsLoading] = useState(false);
  const [nomInput, onNomInputChange] = useInput(baseLocale.nom);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState("");
  const { pushToast } = useContext(LayoutContext);

  const { userSettings, setUserSettings } = useContext(LocalStorageContext);
  const [userSettingsForm, setUserSettingsForm] = useState(userSettings);

  const urlAdminBal = useMemo(() => {
    return `${EDITEUR_URL}/bal/${baseLocale.id}/${token}`;
  }, [baseLocale.id, token]);

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
          <TextInputField
            required
            name="nom"
            id="nom"
            value={nomInput}
            maxWidth={600}
            margin={8}
            disabled={isLoading || baseLocale.status === "demo"}
            label="Nom de la Base Adresse Locale"
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

      <Pane background="white" padding={16} borderRadius={8}>
        <Heading is="h4" marginBottom={12}>
          Partagez l&apos;accès avec d&apos;autres appareils
        </Heading>
        <ShareClipBoard url={urlAdminBal} />
        <br />
        <ShareQRCode url={urlAdminBal} />
        <Alert intent="success" marginTop={12} hasIcon={false}>
          <Pane display="flex" alignItems="center">
            <MobilePhoneIcon size={24} marginRight={8} />
            <Text>
              Mes Adresses fonctionne aussi sur votre mobile. Scannez le code QR
              pour accéder à votre BAL.
            </Text>
          </Pane>
        </Alert>
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
