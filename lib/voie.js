export function getFullVoieName(voie) {
  const {nom, complement} = voie
  return `${nom} ${complement ? `(${complement})` : ''}`
}
