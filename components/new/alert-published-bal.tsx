import { useState, useCallback } from "react";

import { Dialog } from "evergreen-ui";

import { PublicClient, Revision } from "@/lib/api-depot/types";
import { ClientRevisionEnum } from "./create-form";
import AlertPublishedBALApiDepot from "./alert-published-bal/alert-puslished-bal-api-depot";
import AlertPublishedBALMesAdresses from "./alert-published-bal/alert-puslished-bal-mes-adresses";
import AlertPublishedBALMoissoneur from "./alert-published-bal/alert-puslished-bal-moissoneur";

interface AlertPublishedBALProps {
  isShown: boolean;
  revision: Revision;
  onClose: () => void;
  onConfirm: () => void;
}

function AlertPublishedBAL({
  isShown = false,
  revision,
  onClose,
  onConfirm,
}: AlertPublishedBALProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAlertComponent: React.FunctionComponent = useCallback(() => {
    const client: PublicClient = revision.client;
    if (client.legacyId === ClientRevisionEnum.MES_ADRESSES) {
      return <AlertPublishedBALMesAdresses revision={revision} />;
    } else if (client.legacyId === ClientRevisionEnum.MOISSONNEUR_BAL) {
      return <AlertPublishedBALMoissoneur revision={revision} />;
    } else {
      return <AlertPublishedBALApiDepot revision={revision} />;
    }
  }, [revision]);

  const handleConfirmation = () => {
    setIsLoading(true);
    onConfirm();
  };

  return (
    <Dialog
      isShown={isShown}
      title="Attention, votre Base Adresse Locale (BAL) est déjà publiée"
      width="800px"
      confirmLabel={isLoading ? "Création…" : "Continuer"}
      cancelLabel="Annuler"
      isConfirmLoading={isLoading}
      onConfirm={handleConfirmation}
      onCloseComplete={onClose}
    >
      {getAlertComponent}
    </Dialog>
  );
}

export default AlertPublishedBAL;
