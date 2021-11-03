import {trimStart, trimEnd} from 'lodash'
import {toaster} from 'evergreen-ui'

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

export async function listBasesLocales() {
  return request('/bases-locales')
}

export async function listBALByCodeDepartement(codeDepartement) {
  return request(`/stats/departements/${codeDepartement}`)
}

export async function getBaseLocale(balId, token) {
  const headers = token ? {
    authorization: `Token ${token}`
  } : {}

  return request(`/bases-locales/${balId}`, {headers})
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

export async function removeBaseLocale(balId, token) {
  try {
    const response = await request(`/bases-locales/${balId}`, {
      json: false,
      method: 'DELETE',
      headers: {
        authorization: `Token ${token}`
      }
    })

    toaster.success('La Base Adresse Locale a bien été supprimée')
    return response
  } catch (error) {
    toaster.danger('La Base Adresse Locale n’a pas pu être supprimée', {
      description: error.message
    })
  }
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

export function certifyBAL(balId, codeCommune, token, changes) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}/batch`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Token ${token}`
    },
    body: JSON.stringify(changes)
  })
}

export function getCommune(balId, codeCommune) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}`)
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

export async function addVoie(balId, codeCommune, body, token) {
  try {
    const response = await request(`/bases-locales/${balId}/communes/${codeCommune}/voies`, {
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

    toaster.success('La voie a bien été ajoutée')
    return response
  } catch (error) {
    toaster.danger('La voie n’a pas pu être ajoutée', {
      description: error.message
    })
  }
}

export async function editVoie(idVoie, body, token) {
  try {
    const response = await request(`/voies/${idVoie}`, {
      method: 'PUT',
      headers: {
        authorization: `Token ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    toaster.success('La voie a bien été modifiée')
    return response
  } catch (error) {
    toaster.danger('La voie n’a pas pu être modifiée', {
      description: error.message
    })
  }
}

export async function removeVoie(idVoie, token) {
  try {
    const response = await request(`/voies/${idVoie}`, {
      json: false,
      method: 'DELETE',
      headers: {
        authorization: `Token ${token}`
      }
    })

    toaster.success('La voie a bien été supprimée')
    return response
  } catch (error) {
    toaster.danger('La voie n’a pas pu être supprimée', {
      description: error.message
    })
  }
}

export function getToponymes(balId, codeCommune) {
  return request(`/bases-locales/${balId}/communes/${codeCommune}/toponymes`)
}

export function getToponyme(idToponyme) {
  return request(`/toponymes/${idToponyme}`)
}

export async function addToponyme(balId, codeCommune, body, token) {
  try {
    const response = await request(`/bases-locales/${balId}/communes/${codeCommune}/toponymes`, {
      method: 'POST',
      headers: {
        authorization: `Token ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    toaster.success('Le toponyme a bien été ajouté')
    return response
  } catch (error) {
    toaster.danger('Le toponyme n’a pas pu être ajouté : ', {
      description: error.message
    })
  }
}

export async function editToponyme(idToponyme, body, token) {
  try {
    const response = await request(`/toponymes/${idToponyme}`, {
      method: 'PUT',
      headers: {
        authorization: `Token ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    toaster.success('Le toponyme a bien été modifé')
    return response
  } catch (error) {
    toaster.danger('Le toponyme n’a pas pu être modifié : ', {
      description: error.message
    })
  }
}

export async function removeToponyme(idToponyme, token) {
  try {
    const response = await request(`/toponymes/${idToponyme}`, {
      json: false,
      method: 'DELETE',
      headers: {
        authorization: `Token ${token}`
      }
    })

    toaster.success('Le toponyme a bien été supprimé')
    return response
  } catch (error) {
    toaster.danger('Le toponyme n’a pas pu être supprimé', {
      description: error.message
    })
  }
}

export function getNumerosToponyme(idToponyme, token) {
  const headers = token ? {
    authorization: `Token ${token}`
  } : {}

  return request(`/toponymes/${idToponyme}/numeros`, {headers})
}

export function getNumeros(idVoie, token) {
  const headers = token ? {
    authorization: `Token ${token}`
  } : {}

  return request(`/voies/${idVoie}/numeros`, {headers})
}

export async function addNumero(idVoie, body, token) {
  try {
    const response = await request(`/voies/${idVoie}/numeros`, {
      method: 'POST',
      headers: {
        authorization: `Token ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    toaster.success('Le numéro a bien été ajouté')
    return response
  } catch (error) {
    toaster.danger('Le numéro n’a pas pu être ajouté', {
      description: error.message
    })
  }
}

export async function editNumero(idNumero, body, token, isMultiple) {
  try {
    const response = await request(`/numeros/${idNumero}`, {
      method: 'PUT',
      headers: {
        authorization: `Token ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!isMultiple) {
      toaster.success('Le numéro a bien été modifié')
    }

    return response
  } catch (error) {
    if (!isMultiple) {
      toaster.danger('Le numéro n’a pas pu être modifié', {
        description: error.message
      })
    }

    return error
  }
}

export async function removeNumero(idNumero, token, isMultiple) {
  try {
    const response = await request(`/numeros/${idNumero}`, {
      json: false,
      method: 'DELETE',
      headers: {
        authorization: `Token ${token}`
      }
    })

    if (!isMultiple) {
      toaster.success('Le numéro a bien été supprimé')
    }

    return response
  } catch (error) {
    if (!isMultiple) {
      toaster.danger('Le numéro n’a pas pu être supprimé', {
        description: error.message
      })
    }

    return error
  }
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

export async function searchBAL(codeCommune, userEmail) {
  return request(`/bases-locales/search?codeCommune=${codeCommune}&userEmail=${userEmail}`)
}
