export function getFullVoieName(voie, isComplementEnable = false) {
  const {nom, complement} = voie
  if (isComplementEnable) {
    return `${nom} ${complement ? `(${complement})` : ''}`
  }

  return nom
}

export function checkIsToponyme(voie) {
  const {positions, isMetric} = voie || {}
  const position = positions ? positions[0] : null

  return Boolean(position && !isMetric)
}
