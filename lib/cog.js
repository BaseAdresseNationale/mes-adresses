const {keyBy} = require('lodash')
import Communes from '@etalab/decoupage-administratif/data/communes.json'

const communesIndex = keyBy(Communes, 'code')

export function getCommuneNom(code) {
  return communesIndex[code]?.nom || null
}
