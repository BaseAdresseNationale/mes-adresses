import { Numero } from "@/lib/openapi-api-bal";
import {
  Alert,
  AlertCodeNumeroEnum,
  AlertFieldNumeroEnum,
  AlertNumero,
} from "../alerts.types";
import { AlertModelEnum } from "../alerts.types";
import { computeNumeroSuffixeAlerts } from "./fields/numero-suffixe.utils";

export const getNumeroSuffixeAlert = (
  numero: Numero
): AlertNumero | undefined => {
  const [codes, remediation] = computeNumeroSuffixeAlerts(numero.suffixe);
  if (codes.length > 0) {
    return {
      model: AlertModelEnum.NUMERO,
      field: AlertFieldNumeroEnum.NUMERO_SUFFIXE,
      codes,
      value: numero.suffixe,
      remediation,
      voieId: numero.voieId,
      numero: numero.numero,
      suffixe: numero.suffixe,
    } as AlertNumero;
  }
};

export const getNumeroParcelleNotExistAlert = (
  numero: Numero,
  communeParcellesIds: string[]
): AlertNumero[] => {
  const alerts: AlertNumero[] = [];
  if (communeParcellesIds.length > 0) {
    for (const parcelle of numero.parcelles) {
      if (!communeParcellesIds.includes(parcelle)) {
        alerts.push({
          model: AlertModelEnum.NUMERO,
          field: AlertFieldNumeroEnum.NUMERO_PARCELLE,
          codes: [AlertCodeNumeroEnum.PARCELLE_NOT_EXIST],
          value: parcelle,
          voieId: numero.voieId,
          numero: numero.numero,
          suffixe: numero.suffixe,
        } as AlertNumero);
      }
    }
  }
  return alerts;
};

export function isAlertNumeroSuffixe(alert: Alert): boolean {
  return (
    "field" in alert && alert.field === AlertFieldNumeroEnum.NUMERO_SUFFIXE
  );
}

export function isAlertNumeroParcelle(alert: Alert): boolean {
  return (
    "field" in alert && alert.field === AlertFieldNumeroEnum.NUMERO_PARCELLE
  );
}
