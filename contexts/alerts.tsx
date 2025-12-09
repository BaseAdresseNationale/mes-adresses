import React, { useState, useCallback, useMemo, useContext } from "react";
import { without } from "lodash";
import { ChildrenProps } from "@/types/context";
import {
  Alert,
  AlertCodeEnum,
  AlertFieldEnum,
  AlertModelEnum,
  AlertVoie,
  AlertVoieNom,
} from "@/lib/alerts/alerts.types";
import { ExtendedVoieDTO } from "@/lib/openapi-api-bal/models/ExtendedVoieDTO";
import { computeVoieNomAlerts } from "@/lib/alerts/voie-nom.utils";
import BalDataContext from "./bal-data";

interface AlertsContextType {
  voiesAlerts: Record<string, AlertVoie[]>;
  reloadVoiesAlerts: (
    voies: ExtendedVoieDTO[],
    ignoredAlertCodes: AlertCodeEnum[]
  ) => void;
}

const AlertsContext = React.createContext<AlertsContextType | null>(null);

export function AlertsContextProvider(props: ChildrenProps) {
  const [voiesAlerts, setVoiesAlerts] = useState<Record<string, AlertVoie[]>>(
    {}
  );

  const getVoieNomAlert = useCallback(
    (
      voie: ExtendedVoieDTO,
      ignoredAlertCodes: AlertCodeEnum[] = []
    ): AlertVoieNom | undefined => {
      const [codesFound, remediation] = computeVoieNomAlerts(voie.nom);
      const codes = codesFound.filter(
        (code) => !ignoredAlertCodes.includes(code)
      );
      if (codes.length > 0) {
        return {
          model: AlertModelEnum.VOIE,
          field: AlertFieldEnum.VOIE_NOM,
          codes,
          value: voie.nom,
          remediation,
        } as AlertVoieNom;
      }
    },
    []
  );

  const getVoieEmptyAlert = useCallback(
    (voie: ExtendedVoieDTO): AlertVoie | undefined => {
      if (voie.nbNumeros === 0) {
        return {
          model: AlertModelEnum.VOIE,
          codes: [AlertCodeEnum.VOIE_EMPTY],
        } as AlertVoie;
      }
    },
    []
  );

  const reloadVoiesAlerts = useCallback(
    (voies: ExtendedVoieDTO[], ignoredAlertCodes: AlertCodeEnum[] = []) => {
      const newVoiesAlerts: Record<string, Alert[]> = {};
      for (const voie of voies) {
        const alerts = without(
          [
            getVoieNomAlert(voie, ignoredAlertCodes),
            !ignoredAlertCodes.includes(AlertCodeEnum.VOIE_EMPTY) &&
              getVoieEmptyAlert(voie),
          ],
          undefined
        );
        if (alerts.length > 0) {
          newVoiesAlerts[voie.id] = alerts as Alert[];
        }
      }
      setVoiesAlerts(newVoiesAlerts);
    },
    [getVoieNomAlert, getVoieEmptyAlert]
  );

  const value = useMemo(
    () => ({
      voiesAlerts,
      reloadVoiesAlerts,
    }),
    [voiesAlerts, reloadVoiesAlerts]
  );

  return <AlertsContext.Provider value={value} {...props} />;
}

export default AlertsContext;
