import { useCallback, useState, useContext, useEffect } from "react";
import { Alert, Button, Label, Pane, Paragraph } from "evergreen-ui";

import LocalStorageContext from "@/contexts/local-storage";

import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { CommuneSearchField } from "@/components/commune-search";
import { CommuneType } from "@/types/commune";
import { hasBeenSentRecently } from "@/lib/utils/date";

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

  useEffect(() => {
    async function loadBaseLocale() {
      const baseLocale = await BasesLocalesService.findBaseLocale(baseLocaleId);
      setBaseLocale(baseLocale);
    }

    if (baseLocaleId) {
      loadBaseLocale();
    }
  }, [baseLocaleId]);

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
        <Label display="block" marginBottom={4}>
          Avec le courrier électronique officiel de votre commune
        </Label>
        {!baseLocale && (
          <CommuneSearchField
            id="commune"
            required={false}
            innerRef={() => {}}
            initialSelectedItem={commune}
            label="Rechercher une commune"
            placeholder="Roche 42"
            appearance="default"
            maxWidth={500}
            onSelect={setCommune}
          />
        )}
        {error && (
          <Alert marginTop={16} intent="danger">
            {error}
          </Alert>
        )}
        {!baseLocale || baseLocale.status === BaseLocale.status.PUBLISHED ? (
          <Paragraph marginY={8}>
            Un courrier électronique va être envoyé à l’adresse de votre
            commune.
            <br />
            Vous y retrouverez le lien de récupération de la Bases Adresses
            Locales associées à celle-ci.
          </Paragraph>
        ) : (
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
