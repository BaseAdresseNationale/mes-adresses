import { useEffect, useMemo, useState } from "react";
import { Dialog, Heading, Pane } from "evergreen-ui";

import RecoverBALCommune from "./recover-bal-commune";
import RecoverBALMail from "./recover-bal-mail";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMail, setErrorMail] = useState<string | null>(null);
  const [errorCommune, setErrorCommune] = useState<string | null>(null);
  const [baseLocale, setBaseLocale] = useState<BaseLocale | null>(null);

  const handleComplete = () => {
    setIsLoading(false);
    setErrorMail(null);
    setErrorCommune(null);
    onClose();
  };

  useEffect(() => {
    async function loadBaseLocale() {
      const baseLocale = await BasesLocalesService.findBaseLocale(baseLocaleId);
      setBaseLocale(baseLocale);
    }

    if (baseLocaleId) {
      loadBaseLocale();
    }
  }, [baseLocaleId]);

  const isDisplayCommuneRecovery = useMemo(() => {
    return !baseLocale || baseLocale.status === BaseLocale.status.PUBLISHED;
  }, [baseLocale]);
  return (
    <Dialog
      isShown={isShown}
      width={isDisplayCommuneRecovery ? 1000 : 500}
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
          <RecoverBALMail
            defaultEmail={defaultEmail}
            baseLocaleId={baseLocaleId}
            error={errorMail}
            isLoading={isLoading}
            setError={setErrorMail}
            setIsLoading={setIsLoading}
            onClose={onClose}
          />
          {isDisplayCommuneRecovery && (
            <RecoverBALCommune
              baseLocale={baseLocale}
              error={errorCommune}
              isLoading={isLoading}
              setError={setErrorCommune}
              setIsLoading={setIsLoading}
              onClose={onClose}
            />
          )}
        </Pane>
      </Pane>
    </Dialog>
  );
}

export default RecoverBALAlert;
