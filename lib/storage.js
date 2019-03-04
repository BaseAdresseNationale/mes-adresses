import Bal from './bal/model'

const storage = new Map()

export function createBal(data) {
  const bal = new Bal(data)
  storage.set(bal._id, bal)
  return bal._id
}

export function getCommunes(balId) {
  const bal = storage.get(balId)
  if (!bal) {
    throw new Error('No such bal')
  }

  return bal.communes.map(({voies, ...commune}) => commune)
}

export function getCommune(balId, communeCode) {
  const bal = storage.get(balId)
  if (!bal) {
    throw new Error('No such bal')
  }

  const commune = bal.communes.find(commune => commune.code === communeCode)
  if (!commune) {
    throw new Error('No such commune')
  }

  return commune
}

export default storage
