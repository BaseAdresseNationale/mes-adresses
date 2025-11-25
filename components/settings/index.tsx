import { BaseLocale } from "@/lib/openapi-api-bal";
import React, { useState } from "react";
import {
  TextInputField,
  Button,
  Alert,
  Pane,
  CogIcon,
  Heading,
  EyeOpenIcon,
} from "evergreen-ui";
import { BALAdminEmails } from "./bal-admin-emails";
import { useBALSettings } from "@/hooks/bal-settings";
import RenewTokenDialog from "../renew-token-dialog";
import { ShareBALAccessDialog } from "./share/share-bal-access-dialog";

interface SettingsProps {
  baseLocale: BaseLocale;
  token: string;
}

function Settings({ baseLocale, token }: SettingsProps) {
  const [showBALAccessDialog, setShowBALAccessDialog] = useState(false);

  const {
    onSubmit,
    isLoading,
    emailsInput,
    setEmailsInput,
    nomInput,
    setNomInput,
    error,
    nomHasChanged,
    emailsHaveChanged,
    isRenewTokenWarningShown,
    setIsRenewTokenWarningShown,
    setError,
  } = useBALSettings(baseLocale);

  return (
    <Pane>
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
      <Pane
        is="form"
        onSubmit={onSubmit}
        display="flex"
        flexDirection="column"
        background="white"
        paddingX={16}
        marginY={1}
      >
        <TextInputField
          required
          name="nom"
          id="nom"
          value={nomInput}
          maxWidth={600}
          marginTop={8}
          disabled={isLoading}
          label="Nom"
          placeholder="Nom"
          onChange={(e) => setNomInput(e.target.value)}
        />

        <Pane display="flex" gap={16} marginBottom={16}>
          <Pane flex={1}>
            <BALAdminEmails value={emailsInput} onChange={setEmailsInput} />
          </Pane>
          <Button
            type="button"
            onClick={() => setShowBALAccessDialog(true)}
            width="fit-content"
            alignSelf="flex-end"
          >
            <EyeOpenIcon marginRight={8} />
            Partage d&apos;accès
          </Button>
        </Pane>
        {error && (
          <Alert marginBottom={16} intent="danger" title="Erreur">
            {error}
          </Alert>
        )}
        <Button
          height={40}
          type="submit"
          appearance="primary"
          disabled={!nomHasChanged && !emailsHaveChanged}
          isLoading={isLoading}
          width="fit-content"
        >
          {isLoading ? "En cours…" : "Enregistrer les changements"}
        </Button>
      </Pane>
      <RenewTokenDialog
        baseLocaleId={baseLocale.id}
        isShown={isRenewTokenWarningShown}
        setIsShown={setIsRenewTokenWarningShown}
        setError={setError}
      />
      <ShareBALAccessDialog
        baseLocale={baseLocale}
        isShown={showBALAccessDialog}
        token={token}
        onCloseComplete={() => setShowBALAccessDialog(false)}
      />
    </Pane>
  );
}

export default Settings;
