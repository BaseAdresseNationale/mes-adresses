const STORAGE_KEY = 'bal-access'
const RECOVERY_KEY = 'has-recovered'
const RECOVERY_LOCATION_KEY = 'recovery-storage'

export function getBalAccess() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
}

export function storeBalAccess(id, token) {
  const previous = getBalAccess()

  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...previous,
    [id]: token
  }))
}

export function removeBalAccess(id) {
  const balAccess = getBalAccess()
  delete balAccess[id]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(balAccess))
}

export function getBalToken(id) {
  const data = getBalAccess()

  return data[id]
}

export function getHasRecovered() {
  return JSON.parse(localStorage.getItem(RECOVERY_KEY) || false)
}

export function storeHasRecovered(hasRecovered) {
  localStorage.setItem(RECOVERY_KEY, hasRecovered)
}

export function saveRecoveryLocation() {
  sessionStorage.setItem(RECOVERY_LOCATION_KEY, window.location.pathname)
}

export function getRecoveryLocation() {
  const pathname = sessionStorage.getItem(RECOVERY_LOCATION_KEY)
  sessionStorage.removeItem(RECOVERY_LOCATION_KEY)

  return pathname || '/'
}
