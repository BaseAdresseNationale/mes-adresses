import {getBalToken, removeBalAccess} from './tokens'
import {removeBaseLocale} from './bal-api'

export async function removeBAL(balId) {
  const token = getBalToken(balId)
  await removeBaseLocale(balId, token)
  removeBalAccess(balId)
}
