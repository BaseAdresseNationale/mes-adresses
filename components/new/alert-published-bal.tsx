import { useState, useEffect, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { uniq } from "lodash";
import { Pane, Dialog, Alert, Paragraph, Strong } from "evergreen-ui";

import { Client, Revision } from "@/lib/api-depot/types";
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
    const client: Client = revision.client as Client;
    if (client.id === ClientRevisionEnum.MES_ADRESSES) {
      return <AlertPublishedBALMesAdresses revision={revision} />;
    } else if (client.id === ClientRevisionEnum.MOISSONNEUR_BAL) {
      return <AlertPublishedBALMoissoneur revision={revision} />;
    } else {
      return <AlertPublishedBALApiDepot revision={revision} />;
    }
    return null;
  }, [revision]);

  const handleConfirmation = () => {
    setIsLoading(true);
    onConfirm();
  };

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Attention, votre Base Adresse Locale (BAL) est déjà publié"
        width="800px"
        confirmLabel={
          isLoading
            ? "En cours de création…"
            : "Créer une nouvelle Base Adresse Locale"
        }
        cancelLabel="Annuler"
        isConfirmLoading={isLoading}
        onConfirm={handleConfirmation}
        onCloseComplete={onClose}
      >
        {getAlertComponent}
      </Dialog>
    </>
  );
}

export default AlertPublishedBAL;
