import React, { useState, useCallback, useMemo } from "react";
import { ChildrenProps } from "@/types/context";
import {
  AlertCodeEnum,
  AlertVoie,
  AlertNumero,
} from "@/lib/alerts/alerts.types";
import { ExtendedVoieDTO } from "@/lib/openapi-api-bal/models/ExtendedVoieDTO";
import {
  getVoieEmptyAlert,
  getVoieNomAlert,
} from "@/lib/alerts/utils/alerts-voies.utils";
import { BasesLocalesService } from "@/lib/openapi-api-bal/services/BasesLocalesService";
import { getNumeroSuffixeAlert } from "@/lib/alerts/utils/alerts-numeros.utils";

interface AlertsContextType {
  voiesAlerts: Record<string, AlertVoie[]>;
  reloadVoieAlerts: (
    voie: ExtendedVoieDTO,
    ignoredAlertCodes: AlertCodeEnum[]
  ) => void;
  reloadVoiesAlerts: (
    voies: ExtendedVoieDTO[],
    ignoredAlertCodes: AlertCodeEnum[]
  ) => void;
  numerosAlerts: Record<string, AlertNumero[]>;
  reloadNumerosAlerts: (
    balId: string,
    ignoredAlertCodes: AlertCodeEnum[]
  ) => void;
}

const AlertsContext = React.createContext<AlertsContextType | null>(null);

export function AlertsContextProvider(props: ChildrenProps) {
  const [voiesAlerts, setVoiesAlerts] = useState<Record<string, AlertVoie[]>>(
    {}
  );
  const [numerosAlerts, setNumerosAlerts] = useState<
    Record<string, AlertNumero[]>
  >({});

  const reloadNumerosAlerts = useCallback(
    async (balId: string, ignoredAlertCodes: AlertCodeEnum[] = []) => {
      const balNumeros = await BasesLocalesService.findNumeros(
        ["id", "suffixe"],
        balId
      );
      const newNumerosAlerts: Record<string, AlertNumero[]> = {};
      for (const numero of balNumeros) {
        const alerts = [getNumeroSuffixeAlert(numero)];
        const filteredAlerts = alerts
          .filter((alert) => alert !== undefined)
          .filter((alert) =>
            alert.codes.every((code) => !ignoredAlertCodes.includes(code))
          );
        if (alerts.length > 0) {
          newNumerosAlerts[numero.id] = filteredAlerts;
        }
      }
      setNumerosAlerts(newNumerosAlerts);
    },
    []
  );

  const getAlertsVoie = useCallback(
    (voie: ExtendedVoieDTO, ignoredAlertCodes: AlertCodeEnum[] = []) => {
      const alerts = [getVoieNomAlert(voie), getVoieEmptyAlert(voie)];
      const filteredAlerts = alerts
        .filter((alert) => alert !== undefined)
        .filter((alert) =>
          alert.codes.every((code) => !ignoredAlertCodes.includes(code))
        );
      return filteredAlerts;
    },
    []
  );

  const reloadVoieAlerts = useCallback(
    (voie: ExtendedVoieDTO, ignoredAlertCodes: AlertCodeEnum[] = []) => {
      const alerts = getAlertsVoie(voie, ignoredAlertCodes);
      setVoiesAlerts((prev) => ({ ...prev, [voie.id]: alerts }));
    },
    [getAlertsVoie]
  );

  const reloadVoiesAlerts = useCallback(
    (voies: ExtendedVoieDTO[], ignoredAlertCodes: AlertCodeEnum[] = []) => {
      const newVoiesAlerts: Record<string, AlertVoie[]> = {};
      for (const voie of voies) {
        const alerts = getAlertsVoie(voie, ignoredAlertCodes);
        if (alerts.length > 0) {
          newVoiesAlerts[voie.id] = alerts;
        }
      }
      setVoiesAlerts(newVoiesAlerts);
    },
    [getAlertsVoie]
  );

  const value = useMemo(
    () => ({
      voiesAlerts,
      reloadVoieAlerts,
      reloadVoiesAlerts,
      numerosAlerts,
      reloadNumerosAlerts,
    }),
    [
      voiesAlerts,
      reloadVoieAlerts,
      reloadVoiesAlerts,
      numerosAlerts,
      reloadNumerosAlerts,
    ]
  );

  return <AlertsContext.Provider value={value} {...props} />;
}

export default AlertsContext;
