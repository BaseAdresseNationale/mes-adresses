import { Numero } from "@/lib/openapi-api-bal";
import {
  Alert,
  AlertCodeNumeroEnum,
  AlertFieldNumeroEnum,
  AlertNumero,
} from "../alerts.types";
import { AlertModelEnum } from "../alerts.types";

export const getNumeroSuffixeAlert = (
  numero: Numero,
): AlertNumero | undefined => {
  const alphanumericRegex = /^[a-zA-ZÀ-ÿ0-9]+$/g;
  if (numero.suffixe && !numero.suffixe?.match(alphanumericRegex)) {
    console.log(numero);
    return {
      model: AlertModelEnum.NUMERO,
      field: AlertFieldNumeroEnum.NUMERO_SUFFIXE,
      codes: [AlertCodeNumeroEnum.SUFFIXE_CARACTERE_INVALIDE],
      value: numero.suffixe,
      remediation: numero.suffixe?.replace(alphanumericRegex, ""),
      voieId: numero.voieId,
    } as AlertNumero;
  }
};

export function isAlertNumeroSuffixe(alert: Alert): boolean {
  return (
    "field" in alert && alert.field === AlertFieldNumeroEnum.NUMERO_SUFFIXE
  );
}
