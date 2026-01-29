import { BaseLocale } from "@/lib/openapi-api-bal";
import React, { useContext, useState } from "react";
import {
  TextInputField,
  Button,
  Alert,
  Pane,
  CogIcon,
  Heading,
  EyeOpenIcon,
  Label,
  MapCreateIcon,
} from "evergreen-ui";
import { BALAdminEmails } from "./bal-admin-emails";
import { useBALSettings } from "@/hooks/bal-settings";
import RenewTokenDialog from "../renew-token-dialog";
import { ShareBALAccessDialog } from "./share/share-bal-access-dialog";
import FondDeCarteList from "./fond-de-carte-list";
import FondDeCarteDialog from "./fond-de-carte/fond-de-carte-dialog";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface SettingsProps {
  baseLocale: BaseLocale;
  token: string;
}

function Settings({ baseLocale, token }: SettingsProps) {
  const [showBALAccessDialog, setShowBALAccessDialog] = useState(false);
  const [showFondDeCarteDialog, setShowFondDeCarteDialog] = useState(false);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const onShowBALAccessDialog = () => {
    matomoTrackEvent(
      MatomoEventCategory.SETTINGS,
      MatomoEventAction[MatomoEventCategory.SETTINGS].SHARE_ACCESS
    );
    setShowBALAccessDialog(true);
  };

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
            onClick={onShowBALAccessDialog}
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
        <Pane marginBottom={16}>
          <Label display="block" marginBottom={8}>
            Fonds de cartes
          </Label>
          <Pane display="flex" gap={16} marginBottom={16}>
            {baseLocale.settings?.fondsDeCartes?.length > 0 && (
              <FondDeCarteList baseLocale={baseLocale} />
            )}
            <Button
              type="button"
              onClick={() => setShowFondDeCarteDialog(true)}
              width="fit-content"
              alignSelf="flex-end"
            >
              <MapCreateIcon marginRight={8} />
              Ajouter fond de carte
            </Button>
          </Pane>
        </Pane>
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
      <FondDeCarteDialog
        isShown={showFondDeCarteDialog}
        onCloseComplete={() => setShowFondDeCarteDialog(false)}
      />
    </Pane>
  );
}

export default Settings;
