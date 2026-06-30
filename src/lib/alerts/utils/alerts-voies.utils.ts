import { ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import { normalize } from "@ban-team/adresses-util/lib/voies";
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

export const getVoieDoublonAlert = (
  voie: ExtendedVoieDTO,
  voies: ExtendedVoieDTO[]
): AlertVoie | undefined => {
  const voieNomNormalize = normalize(voie.nom);
  const voiesNomsNormalize = voies
    .filter(({ id }) => id !== voie.id)
    .map(({ nom }) => normalize(nom));

  if (voiesNomsNormalize.includes(voieNomNormalize)) {
    return {
      model: AlertModelEnum.VOIE,
      codes: [AlertCodeVoieEnum.DOUBLON_VOIE_NOM],
      value: voie.nom,
    } as AlertVoie;
  }
};

export const getVoiesDoublonsAlertsByIdVoie = (
  voies: ExtendedVoieDTO[]
): Record<string, AlertVoie> => {
  const normalized = voies.map(({ id, nom }) => ({
    id,
    nom,
    normalized_nom: normalize(nom),
  }));

  const grouped = normalized.reduce<Record<string, typeof normalized>>(
    (acc, voie) => {
      acc[voie.normalized_nom] = [...(acc[voie.normalized_nom] ?? []), voie];
      return acc;
    },
    {}
  );

  const duplicates = Object.values(grouped)
    .filter((group) => group.length > 1)
    .flat();

  return Object.fromEntries(
    duplicates.map((voie) => [
      voie.id,
      {
        model: AlertModelEnum.VOIE,
        codes: [AlertCodeVoieEnum.DOUBLON_VOIE_NOM],
        value: voie.nom,
      } as AlertVoie,
    ])
  );
};

export function isAlertVoieNom(alert: Alert): boolean {
  return "field" in alert && alert.field === AlertFieldVoieEnum.VOIE_NOM;
}
