import fetch from 'isomorphic-unfetch'

const {BAL_API_URL} = process.env

async function request(url, options) {
  const res = await fetch(`${BAL_API_URL}${url}`, options)
  return res.json()
}

export function listBasesLocales() {
  return request('/bases-locales')
}

export function getBaseLocale(id) {
  return request(`/bases-locales/${id}`)
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

export function addCommune(id, codeCommune, token) {
  return request(`/bases-locales/${id}/communes/${codeCommune}`, {
    method: 'PUT',
    headers: {
      authorization: `Token ${token}`
    }
  })
}

export function populateCommune(id, codeCommune, token) {
  return request(`/bases-locales/${id}/communes/${codeCommune}/populate`, {
    method: 'POST',
    headers: {
      authorization: `Token ${token}`
    }
  })
}
