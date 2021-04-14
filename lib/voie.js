export function checkIsToponyme(voie) {
  const {positions, isMetric} = voie || {}
  const position = positions ? positions[0] : null

  return Boolean(position && !isMetric)
}
