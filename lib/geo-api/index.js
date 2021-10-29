/* eslint no-restricted-imports: off */
import qs from 'querystring'

const GEO_API_URL = process.env.NEXT_PUBLIC_GEO_API_URL || 'https://geo.api.gouv.fr'

async function request(url, options) {
  const res = await fetch(`${GEO_API_URL}${url}`, options)
  if (!res.ok) {
    throw new Error('Erreur inattendue')
  }

  return res.json()
}

function isCodeDep(token) {
  return ['2A', '2B'].includes(token) || token.match(/^\d{2,3}$/)
}

export function searchCommunes(search, options = {}) {
  const query = {
    nom: search
  }

  const codeDep = search.split(' ').find(token => isCodeDep(token))
  if (codeDep) {
    query.codeDepartement = codeDep
  }

  return request(`/communes?${qs.stringify({
    ...options,
    ...query
  })}`)
}

export function getCommune(code, options = {}) {
  return request(`/communes/${code.toUpperCase()}?${qs.stringify(options)}`)
}

export function getDepartement(code) {
  return request(`/departements/${code.toUpperCase()}`)
}

export function searchCommunesByCode(code) {
  return request(`/communes?code=${code.toUpperCase()}`)
}
