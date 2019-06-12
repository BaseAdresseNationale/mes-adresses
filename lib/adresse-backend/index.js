import fetch from 'isomorphic-unfetch'
import getConfig from 'next/config'

const {publicRuntimeConfig: {
  ADRESSE_BACKEND_URL
}} = getConfig()

async function request(url, opts = {}) {
  const {json, ...options} = opts

  const res = await fetch(`${ADRESSE_BACKEND_URL}${url}`, options)

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

export function getPublishedBasesLocales() {
  return request('/publication/submissions/published')
}

