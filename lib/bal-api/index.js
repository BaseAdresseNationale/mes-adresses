import {trimStart, trimEnd} from 'lodash'

import {getPublishedBasesLocales} from '../adresse-backend'

const BAL_API_URL = process.env.NEXT_PUBLIC_BAL_API_URL || 'https://api-bal.adresse.data.gouv.fr/v1'

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

export async function listBALByCodeDepartement(codeDepartement) {
  const publishedArray = await getPublishedIds()
  const basesLocales = await request(`/stats/departements/${codeDepartement}`)
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

export function createBaseLocaleDemo(body) {
  return request('/bases-locales/create-demo', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
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

export async function transformToDraft(balId, body, token) {
  const baseLocale = await request(`/bases-locales/${balId}/transform-to-draft`, {
    method: 'POST',
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

export function recoverBAL(email, id) {
  return request('/bases-locales/recovery', {
    json: false,
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({email, id})
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

export function getParcelles(balId, codeCommune) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}/parcelles`)
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
    body: JSON.stringify({
      ...body,
      nom: trimStart(trimEnd(body.nom))
    })
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

export function getToponymes(balId, codeCommune) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}/toponymes`)
}

export function getToponyme(idToponyme) {
  return request(`/toponymes/${idToponyme}`)
}

export function addToponyme(balId, codeCommune, body, token) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}/toponymes`, {
    method: 'POST',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export function editToponyme(idToponyme, body, token) {
  return request(`/toponymes/${idToponyme}`, {
    method: 'PUT',
    headers: {
      authorization: `Token ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export function removeToponyme(idToponyme, token) {
  return request(`/toponymes/${idToponyme}`, {
    json: false,
    method: 'DELETE',
    headers: {
      authorization: `Token ${token}`
    }
  })
}

export function getNumerosToponyme(idToponyme) {
  return request(`/toponymes/${idToponyme}/numeros`)
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

export function getContoursCommunes() {
  return request('/stats/couverture-bal')
}

export function searchBAL(codeCommune, userEmail) {
  return request(`/bases-locales/search?codeCommune=${codeCommune}&userEmail=${userEmail}`)
}
