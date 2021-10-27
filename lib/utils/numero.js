export const computeCompletNumero = (numero, suffixe) => {
  if (suffixe && isNaN(suffixe)) {
    return `${numero}${suffixe}`
  }

  return `${numero}${suffixe ? ` ${suffixe}` : ''}`
}
