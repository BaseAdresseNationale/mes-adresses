import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'
import {getPublishedBasesLocales} from '../adresse-backend'

const {publicRuntimeConfig} = getConfig()
const BAL_API_URL = publicRuntimeConfig.BAL_API_URL || 'https://api-bal.adresse.data.gouv.fr/v1'

async function request(url, opts = {}) {
  const {json, ...options} = opts

  const res = await fetch(`${BAL_API_URL}${url}`, options)

  if (!res.ok) {
    switch (res.status) {
      case 403:
        throw new Error('Jeton de sécurité invalide')
      case 404:
        throw new Error('Ressource non trouvée')

      default:
        throw new Error('Erreur inattendue')
    }
  }

  if (json !== false) {
    return res.json()
  }

  return res
}

async function getPublishedIds() {
  const published = await getPublishedBasesLocales()
  return published
    .filter(bal => bal.url.startsWith(BAL_API_URL))
    .map(bal => bal.url.substr(BAL_API_URL.length + '/bases-locales/'.length, 24))
}

function setIfPublished(baseLocale, publishedArray) {
  if (publishedArray.includes(baseLocale._id)) {
    baseLocale.status = 'published'
  }
}

export async function listBasesLocales() {
  const publishedArray = await getPublishedIds()
  const basesLocales = await request('/bases-locales')
  basesLocales.forEach(baseLocale => setIfPublished(baseLocale, publishedArray))
  return basesLocales
}

export async function getBaseLocale(balId, token) {
  const headers = token ? {
    authorization: `Token ${token}`
  } : {}

  const baseLocale = await request(`/bases-locales/${balId}`, {headers})
  const publishedArray = await getPublishedIds()
  setIfPublished(baseLocale, publishedArray)

  return baseLocale
}

export function createBaseLocale(body) {
  return request('/bases-locales', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export function createBaseLocaleTest() {
  return request('/bases-locales/test', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  })
}

export async function updateBaseLocale(balId, body, token) {
  const baseLocale = await request(`/bases-locales/${balId}`, {
    method: 'PUT',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const publishedArray = await getPublishedIds()
  setIfPublished(baseLocale, publishedArray)

  return baseLocale
}

export async function updateBaseLocaleTest(balId, body, token) {
  const baseLocale = await request(`/bases-locales/test/${balId}`, {
    method: 'PUT',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  return baseLocale
}

export function removeBaseLocale(balId, token) {
  return request(`/bases-locales/${balId}`, {
    json: false,
    method: 'DELETE',
    headers: {
      authorization: `Token ${token}`
    }
  })
}

export function uploadBaseLocaleCsv(balId, file, token) {
  return request(`/bases-locales/${balId}/upload`, {
    method: 'POST',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'text/csv'
    },
    body: file
  })
}

export function getBaseLocaleCsvUrl(balId) {
  return `${BAL_API_URL}/bases-locales/${balId}/csv`
}

export function addCommune(balId, codeCommune, token) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}`, {
    method: 'PUT',
    headers: {
      authorization: `Token ${token}`
    }
  })
}

export function getCommuneGeoJson(balId, codeCommune) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}/geojson`)
}

export function removeCommune(balId, codeCommune, token) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}`, {
    method: 'DELETE',
    headers: {
      authorization: `Token ${token}`
    }
  })
}

export function populateCommune(balId, codeCommune, token) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}/populate`, {
    method: 'POST',
    headers: {
      authorization: `Token ${token}`
    }
  })
}

export function getVoies(balId, codeCommune) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}/voies`)
}

export function getVoie(idVoie) {
  return request(`/voies/${idVoie}`)
}

export function addVoie(balId, codeCommune, body, token) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}/voies`, {
    method: 'POST',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export function editVoie(idVoie, body, token) {
  return request(`/voies/${idVoie}`, {
    method: 'PUT',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export function removeVoie(idVoie, token) {
  return request(`/voies/${idVoie}`, {
    json: false,
    method: 'DELETE',
    headers: {
      authorization: `Token ${token}`
    }
  })
}

export function getNumeros(idVoie) {
  return request(`/voies/${idVoie}/numeros`)
}

export function addNumero(idVoie, body, token) {
  return request(`/voies/${idVoie}/numeros`, {
    method: 'POST',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export function editNumero(idNumero, body, token) {
  return request(`/numeros/${idNumero}`, {
    method: 'PUT',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export function removeNumero(idNumero, token) {
  return request(`/numeros/${idNumero}`, {
    json: false,
    method: 'DELETE',
    headers: {
      authorization: `Token ${token}`
    }
  })
}

export function renewToken(balId, token) {
  return request(`/bases-locales/${balId}/token/renew`, {
    method: 'POST',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'application/json'
    }
  })
}
