export const computeCompletNumero = (numero, suffixe) => {
  if (suffixe) {
    if (isNaN(suffixe)) {
      return `${numero}${suffixe}`
    }

    return `${numero} ${suffixe}`
  }

  return `${numero}`
}
