export function getFullVoieName(voie, isComplementEnable = false) {
  const {nom, complement} = voie
  if (isComplementEnable) {
    return `${nom} ${complement ? `(${complement})` : ''}`
  }

  return nom
}
