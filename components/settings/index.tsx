import { BaseLocale } from "@/lib/openapi-api-bal";
import React from "react";
import {
  TextInputField,
  Button,
  Alert,
  Checkbox,
  MobilePhoneIcon,
  Text,
  Pane,
  CogIcon,
  Heading,
} from "evergreen-ui";
import FormContainer from "@/components/form-container";
import FormInput from "@/components/form-input";
import ShareClipBoard from "./share/share-clipboard";
import ShareQRCode from "./share/share-qr-code";
import ShareEmails from "./share/share-emails";
import { useBALSettings } from "@/hooks/bal-settings";
import RenewTokenDialog from "../renew-token-dialog";

interface SettingsProps {
  baseLocale: BaseLocale;
  token?: string;
}

function Settings({ baseLocale, token }: SettingsProps) {
  const {
    onSubmit,
    isLoading,
    balEmails,
    nomInput,
    onNomInputChange,
    error,
    urlAdminBal,
    userSettingsForm,
    setUserSettingsForm,
    nomHasChanged,
    userSettingsHasChanged,
    emailsHaveChanged,
    isRenewTokenWarningShown,
    setIsRenewTokenWarningShown,
    setError,
    email,
    onEmailChange,
    onRemoveEmail,
    onAddEmail,
  } = useBALSettings(baseLocale, token);

  return (
    <Pane height="100%" display="flex" flexDirection="column">
      <Pane
        flexShrink={0}
        elevation={0}
        background="white"
        padding={16}
        display="flex"
        alignItems="center"
        minHeight={64}
      >
        <Pane display="flex" alignItems="center">
          <CogIcon />
          <Heading paddingLeft={5}>Paramètres</Heading>
        </Pane>
      </Pane>

      <FormContainer onSubmit={onSubmit} display="flex" flexDirection="column">
        <Pane marginBottom={6}>
          <FormInput>
            <TextInputField
              required
              name="nom"
              id="nom"
              value={nomInput}
              maxWidth={600}
              marginTop={8}
              disabled={isLoading || baseLocale.status === "demo"}
              label="Nom de la Base Adresse Locale"
              placeholder="Nom"
              onChange={onNomInputChange}
            />
          </FormInput>
        </Pane>

        <Pane
          background="white"
          padding={16}
          borderRadius={8}
          marginBottom={12}
        >
          <ShareEmails
            baseLocale={baseLocale}
            balEmails={balEmails}
            onRemoveEmail={onRemoveEmail}
            onAddEmail={onAddEmail}
            onEmailChange={onEmailChange}
            email={email}
            error={error}
          />
        </Pane>

        <Pane
          background="white"
          padding={16}
          borderRadius={8}
          marginBottom={12}
        >
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
                Mes Adresses fonctionne aussi sur votre mobile. Scannez le code
                QR pour accéder à votre BAL.
              </Text>
            </Pane>
          </Alert>
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
        {error && (
          <Alert marginBottom={16} intent="danger" title="Erreur">
            {error}
          </Alert>
        )}
        <Button
          height={40}
          marginTop={8}
          type="submit"
          appearance="primary"
          disabled={
            !nomHasChanged && !userSettingsHasChanged && !emailsHaveChanged
          }
          isLoading={isLoading}
          width="fit-content"
        >
          {isLoading ? "En cours…" : "Enregistrer les changements"}
        </Button>
      </FormContainer>
      <RenewTokenDialog
        baseLocaleId={baseLocale.id}
        isShown={isRenewTokenWarningShown}
        setIsShown={setIsRenewTokenWarningShown}
        setError={setError}
      />
    </Pane>
  );
}

export default Settings;
