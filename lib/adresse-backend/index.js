const ADRESSE_BACKEND_URL = process.env.NEXT_PUBLIC_ADRESSE_BACKEND_URL || 'https://backend.adresse.data.gouv.fr'

async function request(url, options_ = {}) {
  const {json, ...options} = options_

  const response = await fetch(`${ADRESSE_BACKEND_URL}${url}`, options)

  if (!response.ok) {
    switch (response.status) {
      case 403:
        throw new Error('Jeton de sécurité invalide')
      case 404:
        throw new Error('Ressource non trouvée')

      default:
        throw new Error('Erreur inattendue')
    }
  }

  if (json !== false) {
    return response.json()
  }

  return response
}

export async function getPublishedBasesLocales() {
  if (!process.env.NEXT_PUBLIC_ADRESSE_BACKEND_URL) {
    return []
  }

  const items = await request('/publication/submissions/published')
  return items.filter(item => item.url)
}

