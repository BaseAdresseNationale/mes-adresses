export function formatDateYYYYMMDD(iso = null) {
  const date = iso ? new Date(iso) : new Date()
  return date.toISOString().split('T')[0]
}
