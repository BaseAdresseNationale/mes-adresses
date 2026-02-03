export const computeCompletNumero = (
  numero: number | string | undefined,
  suffixe: string
) => {
  if (!numero) {
    return null;
  }
  if (suffixe && Number.isNaN(suffixe)) {
    return `${numero}${suffixe.toLowerCase()}`;
  }

  return `${numero}${suffixe ? ` ${suffixe.toLowerCase()}` : ""}`;
};
