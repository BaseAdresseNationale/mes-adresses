export const computeCompletNumero = (
  numero: number | string,
  suffixe: string
) => {
  if (suffixe && Number.isNaN(suffixe)) {
    return `${numero}${suffixe.toLowerCase()}`;
  }

  return `${numero}${suffixe ? ` ${suffixe.toLowerCase()}` : ""}`;
};
