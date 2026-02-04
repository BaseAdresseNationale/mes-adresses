import { ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import {
  Alert,
  AlertCodeVoieEnum,
  AlertFieldVoieEnum,
  AlertVoie,
  AlertModelEnum,
} from "../alerts.types";
import { computeVoieNomAlerts } from "./fields/voie-nom.utils";

export const getVoieNomAlert = (
  voie: ExtendedVoieDTO
): AlertVoie | undefined => {
  const [codes, remediation] = computeVoieNomAlerts(voie.nom);
  if (codes.length > 0) {
    return {
      model: AlertModelEnum.VOIE,
      field: AlertFieldVoieEnum.VOIE_NOM,
      codes,
      value: voie.nom,
      remediation,
    } as AlertVoie;
  }
};

export const getVoieEmptyAlert = (
  voie: ExtendedVoieDTO
): AlertVoie | undefined => {
  if (voie.nbNumeros === 0) {
    return {
      model: AlertModelEnum.VOIE,
      codes: [AlertCodeVoieEnum.VOIE_EMPTY],
    } as AlertVoie;
  }
};

export function isAlertVoieNom(alert: Alert): boolean {
  return "field" in alert && alert.field === AlertFieldVoieEnum.VOIE_NOM;
}
