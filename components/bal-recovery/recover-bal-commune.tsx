import { useCallback, useState, useContext, useEffect } from "react";
import NextImage from "next/legacy/image";
import { Alert, Button, Heading, Pane, Paragraph, Strong } from "evergreen-ui";

import LocalStorageContext from "@/contexts/local-storage";

import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { CommuneSearchField } from "@/components/commune-search";
import { CommuneType } from "@/types/commune";
import { hasBeenSentRecently } from "@/lib/utils/date";
import { ApiDepotService } from "@/lib/api-depot";

interface RecoverBALCommuneProps {
  baseLocaleId?: string;
  error?: string;
  isLoading?: boolean;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  onClose: () => void;
}

function RecoverBALCommune({
  baseLocaleId,
  error,
  isLoading,
  setError,
  setIsLoading,
  onClose,
}: RecoverBALCommuneProps) {
  const { recoveryEmailCommuneSent, setRecoveryEmailCommuneSent } =
    useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const [baseLocale, setBaseLocale] = useState<BaseLocale | null>(null);
  const [commune, setCommune] = useState<CommuneType | null>(null);
  const [emailsCommune, setEmailsCommune] = useState<string[]>([]);

  const fetchEmailsCommune = useCallback(async (codeCommune: string) => {
    const emails = await ApiDepotService.getEmailsCommune(codeCommune);
    setEmailsCommune(emails);
  }, []);

  const selectCommune = useCallback(
    (commune: CommuneType) => {
      setCommune(commune);
      fetchEmailsCommune(commune?.code);
    },
    [fetchEmailsCommune]
  );

  useEffect(() => {
    async function loadBaseLocale() {
      const baseLocale = await BasesLocalesService.findBaseLocale(baseLocaleId);
      setBaseLocale(baseLocale);
      if (baseLocale.status === BaseLocale.status.PUBLISHED) {
        await fetchEmailsCommune(baseLocale?.commune);
      }
    }

    if (baseLocaleId) {
      loadBaseLocale();
    }
  }, [baseLocaleId, fetchEmailsCommune]);

  const recoveryCommune = useCallback(async () => {
    const codeCommune = commune?.code || baseLocale?.commune;
    await BasesLocalesService.recoveryBasesLocalesByCommune({
      codeCommune,
    });
    setRecoveryEmailCommuneSent(new Date());
    pushToast({
      title: `Un email a été envoyé à la commune`,
      intent: "success",
    });
    setError(null);
  }, [
    commune?.code,
    baseLocale?.commune,
    setRecoveryEmailCommuneSent,
    pushToast,
    setError,
  ]);

  const handleConfirmCommune = useCallback(async () => {
    setIsLoading(true);

    if (hasBeenSentRecently(recoveryEmailCommuneSent)) {
      setIsLoading(false);
      onClose();
      pushToast({
        title: "Un email a déjà été envoyé, merci de patienter.",
        intent: "warning",
      });
      return;
    }

    try {
      await recoveryCommune();
      onClose();
    } catch (error) {
      setError(error.body?.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    recoveryEmailCommuneSent,
    onClose,
    pushToast,
    recoveryCommune,
    setError,
  ]);

  return (
    <Pane
      width="50%"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      marginTop={16}
      padding={16}
      background="white"
      borderRadius={8}
    >
      <Pane>
        <Pane display="flex" justifyContent="center" marginBottom={8}>
          <NextImage
            width={66}
            height={66}
            src={"/static/images/mairie.svg"}
            alt="logo mairie"
            style={{ filter: "grayscale(100%)" }}
          />
        </Pane>
        <Heading is="h2" marginBottom={8}>
          Avec le courrier électronique officiel de votre commune
        </Heading>
        {!baseLocaleId && (
          <Paragraph marginBottom={8}>
            Renseigner la commune dont vous voulez récupérer les Bases Adresses
            Locales.
          </Paragraph>
        )}
        {!baseLocale && (
          <CommuneSearchField
            id="commune"
            required={false}
            innerRef={() => {}}
            initialSelectedItem={commune}
            label=""
            placeholder="Roche 42"
            appearance="default"
            maxWidth={500}
            onSelect={selectCommune}
          />
        )}
        {error && (
          <Alert marginTop={16} intent="danger">
            {error}
          </Alert>
        )}
        {emailsCommune.length > 0 && (
          <Alert marginTop={16} intent="info" hasIcon={false}>
            <Paragraph color="blue600">
              Un courrier électronique avec le lien de récupération va être
              envoyé à l’adresse de votre commune:{" "}
              <Strong>{emailsCommune.join(", ")}</Strong>
            </Paragraph>
          </Alert>
        )}
        {baseLocale && baseLocale.status !== BaseLocale.status.PUBLISHED && (
          <Alert marginTop={16} intent="danger">
            Vous ne pouvez pas récupérer une Bases Adresses Locales qui
            n&apos;est pas publiée.
          </Alert>
        )}
      </Pane>
      {(!baseLocale || baseLocale.status === BaseLocale.status.PUBLISHED) && (
        <Button
          marginTop={16}
          onClick={handleConfirmCommune}
          appearance="primary"
          disabled={(!Boolean(baseLocaleId) && !commune) || isLoading}
          alignSelf="flex-end"
        >
          {isLoading ? "Chargement..." : "Recevoir le courriel"}
        </Button>
      )}
    </Pane>
  );
}

export default RecoverBALCommune;
