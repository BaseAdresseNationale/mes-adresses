import { Numero } from "@/lib/openapi-api-bal";
import {
  Alert,
  AlertCodeNumeroEnum,
  AlertFieldNumeroEnum,
  AlertNumero,
} from "../alerts.types";
import { AlertModelEnum } from "../alerts.types";
import { computeNumeroSuffixeAlerts } from "./fields/numero-suffixe.utils";
import CadastreContext from "@/contexts/cadastre";
import { useContext } from "react";

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
    } as AlertNumero;
  }
};

export const getNumeroParcelleNotExistAlert = (
  numero: Numero,
  communeParcelles: string[]
): AlertNumero | undefined => {
  for (const parcelle of numero.parcelles) {
    if (!communeParcelles.includes(parcelle)) {
      return {
        model: AlertModelEnum.NUMERO,
        field: AlertFieldNumeroEnum.NUMERO_PARCELLE,
        codes: [AlertCodeNumeroEnum.PARCELLE_NOT_EXIST],
        value: parcelle,
        voieId: numero.voieId,
        numero: numero.numero,
      } as AlertNumero;
    }
  }
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
