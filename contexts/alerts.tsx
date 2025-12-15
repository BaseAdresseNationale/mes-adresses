import React, { useState, useCallback, useMemo, useContext } from "react";
import { without } from "lodash";
import { ChildrenProps } from "@/types/context";
import {
  AlertCodeVoieEnum,
  AlertCodeEnum,
  AlertModelEnum,
  AlertVoie,
  AlertFieldVoieEnum,
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
    ): AlertVoie | undefined => {
      const [codesFound, remediation] = computeVoieNomAlerts(voie.nom);
      const codes = codesFound.filter(
        (code) => !ignoredAlertCodes.includes(code)
      );
      if (codes.length > 0) {
        return {
          model: AlertModelEnum.VOIE,
          field: AlertFieldVoieEnum.VOIE_NOM,
          codes,
          value: voie.nom,
          remediation,
        } as AlertVoie;
      }
    },
    []
  );

  const getVoieEmptyAlert = useCallback(
    (voie: ExtendedVoieDTO): AlertVoie | undefined => {
      if (voie.nbNumeros === 0) {
        return {
          model: AlertModelEnum.VOIE,
          codes: [AlertCodeVoieEnum.VOIE_EMPTY],
        } as AlertVoie;
      }
    },
    []
  );

  const reloadVoiesAlerts = useCallback(
    (voies: ExtendedVoieDTO[], ignoredAlertCodes: AlertCodeEnum[] = []) => {
      const newVoiesAlerts: Record<string, AlertVoie[]> = {};
      for (const voie of voies) {
        const alerts = [
          getVoieNomAlert(voie, ignoredAlertCodes),
          getVoieEmptyAlert(voie),
        ];
        const filteredAlerts = alerts
          .filter((alert) => alert !== undefined)
          .filter((alert) =>
            alert.codes.every((code) => !ignoredAlertCodes.includes(code))
          );
        if (alerts.length > 0) {
          newVoiesAlerts[voie.id] = filteredAlerts;
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
