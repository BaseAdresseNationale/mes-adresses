export const computeCompletNumero = (numero, suffixe) => {
  if (numero) {
    if (!isNaN(suffixe)) {
      return `${numero} ${suffixe}`
    }

    return `${numero}${suffixe}`
  }

  return `- ${suffixe}`
}
