export const computeCompletNumero = (numero, suffixe) => {
  if (suffixe && Number.isNaN(suffixe)) {
    return `${numero}${suffixe}`
  }

  return `${numero}${suffixe ? ` ${suffixe}` : ''}`
}
