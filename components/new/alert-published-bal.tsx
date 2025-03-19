import { useState, useCallback, useMemo } from "react";

import { Alert, Dialog, Pane } from "evergreen-ui";

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

  const getAlertComponent = useMemo(() => {
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
      hasCancel={!isLoading}
      isConfirmLoading={isLoading}
      onConfirm={handleConfirmation}
      onCloseComplete={onClose}
    >
      <>
        {getAlertComponent}
        {isLoading && (
          <Pane
            position="fixed"
            left="0"
            bottom="80px"
            width="100%"
            paddingTop={12}
            paddingLeft={24}
            paddingRight={24}
            background="white"
          >
            <Alert
              intent="none"
              title="Cette operation peut prendre plusieurs minutes"
              marginTop={12}
            />
          </Pane>
        )}
      </>
    </Dialog>
  );
}

export default AlertPublishedBAL;
