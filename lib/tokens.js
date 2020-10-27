const STORAGE_KEY = 'bal-access'

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
  return JSON.parse(localStorage.getItem('has-recovery') || false)
}

export function setHasRecovered(hasRecovered) {
  localStorage.setItem('has-recovery', hasRecovered)
}
