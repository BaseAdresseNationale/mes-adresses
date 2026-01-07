import { useCallback, useState, useContext } from "react";
import {
  Alert,
  Button,
  Dialog,
  EnvelopeIcon,
  Heading,
  Label,
  Pane,
  Paragraph,
  TextInput,
} from "evergreen-ui";

import { validateEmail } from "@/lib/utils/email";

import LocalStorageContext from "@/contexts/local-storage";

import { useInput } from "@/hooks/input";
import { BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import { CommuneSearchField } from "@/components/commune-search";
import { CommuneType } from "@/types/commune";

const hasBeenSentRecently = (sentAt) => {
  const now = new Date();

  const floodLimitTime = new Date(sentAt);
  floodLimitTime.setMinutes(floodLimitTime.getMinutes() + 5);
  return now < floodLimitTime;
};

interface RecoverBALAlertProps {
  isShown: boolean;
  defaultEmail?: string;
  baseLocaleId?: string;
  onClose: () => void;
}

function RecoverBALAlert({
  isShown,
  defaultEmail,
  baseLocaleId,
  onClose,
}: RecoverBALAlertProps) {
  const {
    recoveryEmailSent,
    setRecoveryEmailSent,
    recoveryEmailCommuneSent,
    setRecoveryEmailCommuneSent,
  } = useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const [commune, setCommune] = useState<CommuneType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, onEmailChange, resetEmail] = useInput(defaultEmail);
  const [errorMail, setErrorMail] = useState<string | null>(null);
  const [errorCommune, setErrorCommune] = useState<string | null>(null);
  console.log(baseLocaleId, !Boolean(baseLocaleId), !commune);
  const handleComplete = () => {
    setIsLoading(false);
    setErrorMail(null);
    setErrorCommune(null);
    onClose();
  };

  const startConfirmation = useCallback(
    (date: Date) => {
      if (hasBeenSentRecently(date)) {
        setIsLoading(false);
        onClose();
        pushToast({
          title: "Un email a déjà été envoyé, merci de patienter.",
          intent: "warning",
        });
        throw new Error("Un email a déjà été envoyé, merci de patienter.");
      }
    },
    [onClose, pushToast]
  );

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
    setErrorMail(null);
  }, [email, baseLocaleId, setRecoveryEmailSent, pushToast]);

  const handleConfirmEmail = useCallback(async () => {
    setIsLoading(true);

    try {
      startConfirmation(recoveryEmailSent);
    } catch {
      return;
    }

    try {
      await recoveryBasesLocales();
      resetEmail();
      onClose();
    } catch (error) {
      setErrorMail(error.body?.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    startConfirmation,
    recoveryEmailSent,
    recoveryBasesLocales,
    resetEmail,
    onClose,
  ]);

  const recoveryCommune = useCallback(async () => {
    await BasesLocalesService.recoveryBasesLocalesByCommune({
      codeCommune: commune?.code,
      id: baseLocaleId,
    });
    setRecoveryEmailCommuneSent(new Date());
    pushToast({
      title: `Un email a été envoyé à la commune`,
      intent: "success",
    });
    setErrorCommune(null);
  }, [commune?.code, baseLocaleId, setRecoveryEmailCommuneSent, pushToast]);

  const handleConfirmCommune = useCallback(async () => {
    setIsLoading(true);

    try {
      startConfirmation(recoveryEmailCommuneSent);
    } catch {
      return;
    }

    try {
      await recoveryCommune();
      resetEmail();
      onClose();
    } catch (error) {
      setErrorCommune(error.body?.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    startConfirmation,
    recoveryEmailCommuneSent,
    recoveryCommune,
    resetEmail,
    onClose,
  ]);

  return (
    <Dialog
      isShown={isShown}
      width={1000}
      hasHeader={false}
      hasFooter={false}
      onCloseComplete={() => handleComplete()}
    >
      <Pane
        background="gray300"
        marginX="-32px"
        marginY="-8px"
        borderRadius={8}
        padding={16}
      >
        <Pane background="white" borderRadius={8} padding={16}>
          <Heading is="h2" textAlign="center">
            {baseLocaleId
              ? "Récupération de votre Base Adresse Locale"
              : "Récupération de mes Bases Adresses Locales"}
          </Heading>
        </Pane>
        <Pane display="flex" gap={16}>
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
              {errorMail && (
                <Alert marginTop={16} intent="danger">
                  {errorMail}
                </Alert>
              )}

              <Paragraph marginTop={16}>
                Un courrier électronique va être envoyé à l’adresse que vous
                avez renseignée.
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
              {!Boolean(baseLocaleId) && (
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
              {errorCommune && (
                <Alert marginTop={16} intent="danger">
                  {errorCommune}
                </Alert>
              )}
              <Paragraph marginY={8}>
                Un courrier électronique va être envoyé à l’adresse de votre
                commune.
                <br />
                Vous y retrouverez le lien de récupération de la Bases Adresses
                Locales associées à celle-ci.
              </Paragraph>
            </Pane>
            <Button
              marginTop={16}
              onClick={handleConfirmCommune}
              appearance="primary"
              disabled={(!Boolean(baseLocaleId) && !commune) || isLoading}
              alignSelf="flex-end"
            >
              {isLoading ? "Chargement..." : "Recevoir le courriel"}
            </Button>
          </Pane>
        </Pane>
      </Pane>
    </Dialog>
  );
}

export default RecoverBALAlert;
