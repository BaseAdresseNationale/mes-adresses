import { useCallback, useContext } from "react";
import { Alert, Button, Label, Pane, Paragraph, TextInput } from "evergreen-ui";

import { validateEmail } from "@/lib/utils/email";

import LocalStorageContext from "@/contexts/local-storage";

import { useInput } from "@/hooks/input";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { hasBeenSentRecently } from "@/lib/utils/date";

interface RecoverBALMailProps {
  defaultEmail?: string;
  baseLocaleId?: string;
  error?: string;
  isLoading?: boolean;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  onClose: () => void;
}

function RecoverBALMail({
  defaultEmail,
  error,
  isLoading,
  setError,
  setIsLoading,
  baseLocaleId,
  onClose,
}: RecoverBALMailProps) {
  const { recoveryEmailSent, setRecoveryEmailSent } =
    useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const [email, onEmailChange, resetEmail] = useInput(defaultEmail);

  const recoveryBasesLocales = useCallback(async () => {
    await BasesLocalesService.recoveryBasesLocales({
      email,
      id: baseLocaleId,
    });
    setRecoveryEmailSent(new Date());
    pushToast({
      title: `Un email a été envoyé à l’adresse ${email}`,
      intent: "success",
    });
    setError(null);
  }, [email, baseLocaleId, setRecoveryEmailSent, pushToast, setError]);

  const handleConfirmEmail = useCallback(async () => {
    setIsLoading(true);

    if (hasBeenSentRecently(recoveryEmailSent)) {
      setIsLoading(false);
      onClose();
      pushToast({
        title: "Un email a déjà été envoyé, merci de patienter.",
        intent: "warning",
      });
      throw new Error("Un email a déjà été envoyé, merci de patienter.");
    }

    try {
      await recoveryBasesLocales();
      resetEmail();
      onClose();
    } catch (error) {
      setError(error.body?.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    recoveryEmailSent,
    onClose,
    pushToast,
    recoveryBasesLocales,
    resetEmail,
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
        {/* <EnvelopeIcon size={40} /> */}
        <Label display="block" marginBottom={16}>
          Avec votre adresse de courrier électronique
        </Label>
        <TextInput
          display="block"
          type="email"
          width="100%"
          placeholder="adresse@courriel.fr"
          maxWidth={400}
          value={email}
          onChange={onEmailChange}
        />
        {error && (
          <Alert marginTop={16} intent="danger">
            {error}
          </Alert>
        )}

        <Paragraph marginTop={16}>
          Un courrier électronique va être envoyé à l’adresse que vous avez
          renseignée.
          <br />
          {}
        </Paragraph>
        <Paragraph marginY={8}>
          {baseLocaleId
            ? "Vous y retrouverez un lien d’administration de votre Base Adresse Locale. Il vous suffira alors de cliquer sur le lien afin de pouvoir la retrouver sur votre espace."
            : "Vous y retrouverez la liste de toutes les Bases Adresses Locales associées à celle-ci. Il vous suffira alors de cliquer sur les liens qui y sont associés afin de pouvoir les retrouver sur votre espace."}
        </Paragraph>
      </Pane>
      <Button
        marginTop={16}
        onClick={handleConfirmEmail}
        appearance="primary"
        disabled={!validateEmail(email) || isLoading}
        alignSelf="flex-end"
      >
        {isLoading ? "Chargement..." : "Recevoir le courriel"}
      </Button>
    </Pane>
  );
}

export default RecoverBALMail;
