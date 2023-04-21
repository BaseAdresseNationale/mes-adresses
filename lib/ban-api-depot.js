const BAN_API_DEPOT = process.env.NEXT_PUBLIC_BAN_API_DEPOT || 'https://plateforme-bal.adresse.data.gouv.fr/api-depot'

async function request(url) {
  const res = await fetch(`${BAN_API_DEPOT}${url}`)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  return res.json()
}

export async function getRevisions(codeCommune) {
  return request(`/communes/${codeCommune}/revisions`)
}
