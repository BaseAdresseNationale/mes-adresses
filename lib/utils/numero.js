export const computeCompletNumero = (numero, suffixe) => {
  if (!isNaN(suffixe)) {
    return `${numero} ${suffixe}`
  }

  return `${numero}${suffixe}`
}
