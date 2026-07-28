import { isEqual } from "lodash";
import { SerializedNumero, SerializedToponyme, SerializedVoie } from "@/lib/openapi-api-bal";

export function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Oui" : "Non";
  }

  if (Array.isArray(value)) {
    return value.length === 0
      ? "—"
      : `${value.length} élément${value.length > 1 ? "s" : ""}`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== null && v !== undefined && v !== ""
    );
    return entries.length === 0
      ? "—"
      : entries.map(([key, v]) => `${key}: ${v}`).join(", ");
  }

  return String(value);
}

export interface FieldConfig<T> {
  key: keyof T;
  label: string;
  format?: (value: T[keyof T]) => string;
}

export function getFieldDisplayValue<T>(
  field: FieldConfig<T>,
  value: T[keyof T]
): string {
  return field.format ? field.format(value) : formatFieldValue(value);
}

export function getChangedFields<T>(
  before: T | null | undefined,
  after: T | null | undefined,
  fields: FieldConfig<T>[]
): FieldConfig<T>[] {
  return fields.filter(
    (field) => !isEqual(before?.[field.key], after?.[field.key])
  );
}

export function hasFieldValue(value: unknown): boolean {
  if (value === null || value === undefined || value === "") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(
      (v) => v !== null && v !== undefined && v !== ""
    );
  }

  return true;
}

export function getFilledFields<T>(
  payload: T | null | undefined,
  fields: FieldConfig<T>[]
): FieldConfig<T>[] {
  return fields.filter((field) => hasFieldValue(payload?.[field.key]));
}

function formatTypeNumerotation(value: SerializedVoie["typeNumerotation"]): string {
  if (value === SerializedVoie.typeNumerotation.NUMERIQUE) {
    return "Numérique";
  }
  if (value === SerializedVoie.typeNumerotation.METRIQUE) {
    return "Métrique";
  }
  return formatFieldValue(value);
}

export const NUMERO_FIELDS: FieldConfig<SerializedNumero>[] = [
  { key: "numero", label: "Numéro" },
  { key: "suffixe", label: "Suffixe" },
  { key: "comment", label: "Commentaire" },
  { key: "parcelles", label: "Parcelles cadastrales" },
  { key: "certifie", label: "Certifié" },
  { key: "communeDeleguee", label: "Commune déléguée" },
];

export const VOIE_FIELDS: FieldConfig<SerializedVoie>[] = [
  { key: "nom", label: "Nom" },
  { key: "nomAlt", label: "Nom alternatif" },
  {
    key: "typeNumerotation",
    label: "Numérotation",
    format: formatTypeNumerotation,
  },
  { key: "comment", label: "Commentaire" },
];

export const TOPONYME_FIELDS: FieldConfig<SerializedToponyme>[] = [
  { key: "nom", label: "Nom" },
  { key: "nomAlt", label: "Nom alternatif" },
  { key: "communeDeleguee", label: "Commune déléguée" },
  { key: "parcelles", label: "Parcelles cadastrales" },
];

export function isVoieGeometryChanged(
  before: SerializedVoie | null | undefined,
  after: SerializedVoie | null | undefined
): boolean {
  return (
    !isEqual(before?.centroid, after?.centroid) ||
    !isEqual(before?.trace, after?.trace) ||
    !isEqual(before?.bbox, after?.bbox)
  );
}

export interface NumeroIdsDiff {
  added: number;
  removed: number;
}

export function getNumeroIdsDiff(
  before: string[] = [],
  after: string[] = []
): NumeroIdsDiff {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  return {
    added: after.filter((id) => !beforeSet.has(id)).length,
    removed: before.filter((id) => !afterSet.has(id)).length,
  };
}

export function getNumeroLabel(numero: SerializedNumero): string {
  return `${numero.numero}${numero.suffixe ?? ""}`;
}

export function formatNumeroCount(count: number, adjective: string): string {
  const plural = count > 1 ? "s" : "";
  return `${count} numéro${plural} ${adjective}${plural}`;
}
