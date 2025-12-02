import React, { useState, useCallback, useMemo } from "react";

import { ChildrenProps } from "@/types/context";
import { Alert, AlertFieldEnum, AlertVoieNom } from "@/lib/alerts/alerts.types";
import { ExtendedVoieDTO } from "@/lib/openapi-api-bal/models/ExtendedVoieDTO";
import { computeVoieNomAlerts } from "@/lib/alerts/voie-nom.utils";

interface AlertsContextType {
  voieAlerts: Record<string, Alert>;
  reloadVoieAlerts: (voies: ExtendedVoieDTO[]) => void;
}

const AlertsContext = React.createContext<AlertsContextType | null>(null);

export function AlertsContextProvider(props: ChildrenProps) {
  const [voieAlerts, setVoieAlerts] = useState<Record<string, Alert>>({});

  const getVoieNomAlert = useCallback(
    (voie: ExtendedVoieDTO): AlertVoieNom | undefined => {
      const [codes, remediation] = computeVoieNomAlerts(voie.nom);

      if (codes.length > 0) {
        return {
          codes,
          field: AlertFieldEnum.VOIE_NOM,
          value: voie.nom,
          remediation,
        } as AlertVoieNom;
      }
    },
    []
  );

  const reloadVoieAlerts = useCallback(
    (voies: ExtendedVoieDTO[]) => {
      const newVoieAlerts: Record<string, Alert> = {};
      for (const voie of voies) {
        const alert = getVoieNomAlert(voie);
        if (alert) {
          newVoieAlerts[voie.id] = alert;
        }
      }
      setVoieAlerts(newVoieAlerts);
    },
    [getVoieNomAlert]
  );

  const value = useMemo(
    () => ({
      voieAlerts,
      reloadVoieAlerts,
    }),
    [voieAlerts, reloadVoieAlerts]
  );

  return <AlertsContext.Provider value={value} {...props} />;
}

export default AlertsContext;
