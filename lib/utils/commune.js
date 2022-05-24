export function isCOM(codeCommune) {
  const prefix2 = codeCommune.slice(0, 2)
  const prefix3 = codeCommune.slice(0, 3)

  return prefix2 > '97' || (prefix2 === '97' && !['971', '972', '973', '974', '976'].includes(prefix3))
}
