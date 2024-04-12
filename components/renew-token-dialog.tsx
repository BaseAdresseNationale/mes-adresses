import { useState, useCallback } from "react";
import { Pane, Dialog, Paragraph, Alert, toaster } from "evergreen-ui";
import { BasesLocalesService } from "@/lib/openapi";

interface RenewTokenDialogProps {
  token: string;
  baseLocaleId: string;
  isShown: boolean;
  setIsShown: (isShown: boolean) => void;
  setError: (error: string) => void;
}

function RenewTokenDialog({
  token,
  baseLocaleId,
  isShown,
  setIsShown,
  setError,
}: RenewTokenDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);

    try {
      await BasesLocalesService.renewTokenBaseLocale(baseLocaleId);

      toaster.success("Les autorisations ont été renouvellé avec succès !");
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
    setIsShown(false);
  }, [baseLocaleId, setError, setIsShown]);

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Renouvellement des autorisations"
        intent="success"
        cancelLabel="Annuler"
        confirmLabel="Valider"
        isConfirmLoading={isLoading}
        onConfirm={() => handleConfirm()}
        onCloseComplete={() => setIsShown(false)}
      >
        <Paragraph>
          Vous avez supprimé un ou plusieurs collaborateurs, souhaitez-vous
          procéder au renouvellement des autorisations ?
        </Paragraph>
        <Alert title="Action irréversible" marginY={8} intent="warning">
          Vous ne pourrez plus modifier la Base Adresse Locale avant de
          récupérer la nouvelle autorisation que vous recevrez par courriel.
        </Alert>
      </Dialog>
    </Pane>
  );
}

export default RenewTokenDialog;
