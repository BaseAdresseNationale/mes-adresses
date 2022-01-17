export const computeCompletNumero = (numero, suffixe) => {
  if (suffixe && Number.isNaN(suffixe)) {
    return `${numero}${suffixe.toLowerCase()}`
  }

  return `${numero}${suffixe ? ` ${suffixe.toLowerCase()}` : ''}`
}
