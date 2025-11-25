import React, { useState, useCallback, useMemo } from "react";

import { ChildrenProps } from "@/types/context";
import { Alert, AlertFieldEnum, AlertVoieNom } from "@/lib/alerts/alerts.types";
import { ExtendedVoieDTO } from "@/lib/openapi-api-bal/models/ExtendedVoieDTO";
import { computeVoieNomAlerts } from "@/lib/alerts/voie-nom.utils";

interface AlertsContextType {
  voieAlerts: Record<string, Alert>;
  reloadVoieAlerts: (voies: ExtendedVoieDTO[]) => void;
  reloadVoieAlert: (voie: ExtendedVoieDTO) => void;
}

const AlertsContext = React.createContext<AlertsContextType | null>(null);

export function AlertsContextProvider(props: ChildrenProps) {
  const [voieAlerts, setVoieAlerts] = useState<Record<string, Alert>>({});

  const deleteVoieAlert = useCallback(
    (voieId: string) => {
      const copyVoieAlerts = { ...voieAlerts };
      delete copyVoieAlerts[voieId];
      setVoieAlerts(copyVoieAlerts);
    },
    [voieAlerts]
  );
  const updateVoieAlert = useCallback(
    (voie: ExtendedVoieDTO) => {
      const [codes, remediation] = computeVoieNomAlerts(voie.nom);
      if (codes.length > 0) {
        setVoieAlerts({
          ...voieAlerts,
          [voie.id]: {
            codes,
            field: AlertFieldEnum.VOIE_NOM,
            value: voie.nom,
            remediation,
          } as AlertVoieNom,
        });
      }
    },
    [voieAlerts]
  );

  const reloadVoieAlert = useCallback(
    (voie: ExtendedVoieDTO) => {
      const existingAlert = voieAlerts[voie.id];
      if (existingAlert) {
        if (existingAlert.value !== voie.nom) {
          deleteVoieAlert(voie.id);
          updateVoieAlert(voie);
        }
      } else {
        updateVoieAlert(voie);
      }
    },
    [deleteVoieAlert, updateVoieAlert, voieAlerts]
  );

  const reloadVoieAlerts = useCallback(
    (voies: ExtendedVoieDTO[]) => {
      for (const voie of voies) {
        reloadVoieAlert(voie);
      }
    },
    [reloadVoieAlert]
  );

  const value = useMemo(
    () => ({
      voieAlerts,
      reloadVoieAlerts,
      reloadVoieAlert,
    }),
    [voieAlerts, reloadVoieAlerts, reloadVoieAlert]
  );

  return <AlertsContext.Provider value={value} {...props} />;
}

export default AlertsContext;
