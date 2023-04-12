/* eslint no-restricted-imports: off */
import qs from 'querystring'
import {toaster} from 'evergreen-ui'

const GEO_API_URL = process.env.NEXT_PUBLIC_GEO_API_URL || 'https://geo.api.gouv.fr'

async function request(url, options) {
  try {
    const res = await fetch(`${GEO_API_URL}${url}`, options)
    return res.json()
  } catch (error) {
    toaster.danger('Erreur inattendue', {
      description: error.message
    })
  }

  return null
}

function isCodeDep(token) {
  return ['2A', '2B'].includes(token) || token.match(/^\d{2,3}$/)
}

export async function searchCommunes(search, options = {}) {
  const query = {
    nom: search
  }

  const codeDep = search.split(' ').find(token => isCodeDep(token))
  if (codeDep) {
    query.codeDepartement = codeDep
  }

  const res = await request(`/communes?${qs.stringify({
    ...options,
    ...query
  })}`)
  return res || []
}

export function getCommune(code, options = {}) {
  return request(`/communes/${code.toUpperCase()}?${qs.stringify(options)}`)
}

export function getDepartement(code) {
  return request(`/departements/${code.toUpperCase()}`)
}

export async function searchCommunesByCode(code) {
  const res = await request(`/communes?code=${code.toUpperCase()}`)
  return res || []
}
