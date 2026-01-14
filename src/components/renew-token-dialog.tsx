"use client";

import { useState, useCallback, useContext } from "react";
import { Pane, Dialog, Paragraph, Alert } from "evergreen-ui";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import LocalStorageContext from "@/contexts/local-storage";
import TokenContext from "@/contexts/token";

interface RenewTokenDialogProps {
  baseLocaleId: string;
  isShown: boolean;
  setIsShown: (isShown: boolean) => void;
  setError: (error: string) => void;
}

function RenewTokenDialog({
  baseLocaleId,
  isShown,
  setIsShown,
  setError,
}: RenewTokenDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toaster } = useContext(LayoutContext);
  const { addBalAccess } = useContext(LocalStorageContext);
  const { reloadEmails } = useContext(TokenContext);

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);

    const renewTokenBaseLocale = toaster(
      () => BasesLocalesService.renewTokenBaseLocale(baseLocaleId),
      "Les autorisations ont été renouvellé avec succès",
      "Impossible de renouveller les autorisations",
      (err) => {
        setError(err.message);
      }
    );

    const bal: BaseLocale = await renewTokenBaseLocale();

    addBalAccess(bal.id, bal.token);
    reloadEmails();
    setIsLoading(false);
    setIsShown(false);
  }, [baseLocaleId, setError, setIsShown, toaster, addBalAccess, reloadEmails]);

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
