import fetch from 'isomorphic-unfetch'

const {BAL_API_URL} = process.env

async function request(url, options) {
  const res = await fetch(`${BAL_API_URL}${url}`, options)
  return res.json()
}

export function listBasesLocales() {
  return request('/bases-locales')
}

export function getBaseLocale(balId) {
  return request(`/bases-locales/${balId}`)
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

export function addCommune(balId, codeCommune, token) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}`, {
    method: 'PUT',
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
