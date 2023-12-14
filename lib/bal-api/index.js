import {trimStart, trimEnd} from 'lodash'
import {toaster} from 'evergreen-ui'

const BAL_API_URL = process.env.NEXT_PUBLIC_BAL_API_URL || 'https://api-bal.adresse.data.gouv.fr/v2'

async function request(url, opts = {}) {
  const {json, ...options} = opts

  const res = await fetch(`${BAL_API_URL}${url}`, options)

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message)
  }

  if (json !== false) {
    return res.json()
  }

  return res
}

async function editRequest(url, options, succesLabel, failLabel) {
  try {
    const response = await fetch(`${BAL_API_URL}${url}`, options)
    const json = await response.json()

    if (!response.ok) {
      if (response.status === 400) {
        return {validationMessages: json.validation}
      }

      throw new Error(json.message)
    }

    toaster.success(succesLabel)
    return {...json}
  } catch (error) {
    toaster.danger(failLabel, {
      description: error.message
    })
  }
}

export async function getHabilitation(token, baseLocaleId) {
  return request(`/bases-locales/${baseLocaleId}/habilitation`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    }
  })
}

export async function createHabilitation(token, baseLocaleId) {
  try {
    const response = await request(`/bases-locales/${baseLocaleId}/habilitation`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    })

    return response
  } catch (error) {
    toaster.danger('Impossible de demander une habilitation', {
      description: error.message
    })
  }
}

export async function sendAuthenticationCode(token, baseLocale, communeEmail) {
  const response = await fetch(`${BAL_API_URL}/bases-locales/${baseLocale._id}/habilitation/email/send-pin-code`, {
    method: 'POST',
    json: false,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    }
  })

  if (response.status === 409) {
    toaster.notify('Un courriel a déjà été envoyé', {
      description: `Veuillez consulter la boite de réception de l’adresse ${communeEmail}.`
    })
  } else if (response.status === 200) {
    toaster.success('Le courriel a bien été envoyé', {
      description: `Un code d’authentification vient d’être envoyé à l’adresse ${communeEmail}.`
    })
  } else {
    const error = await response.json()
    throw new Error(error.message)
  }
}

export async function validateAuthenticationCode(token, baseLocaleId, code) {
  try {
    const response = await request(`/bases-locales/${baseLocaleId}/habilitation/email/validate-pin-code`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({code})
    })

    if (response.validated) {
      toaster.success('Vous êtes authentifié')
    } else {
      toaster.danger('Impossible de vous authentifier', {
        description: response.error
      })
    }

    return response
  } catch (error) {
    toaster.danger('Impossible de vous authentifier', {
      description: error.message
    })
  }
}

export async function getBasesLocales() {
  const allBAL = await request('/bases-locales')

  return allBAL.filter(bal => !bal._deleted)
}

export async function searchBasesLocales(query) {
  const {page = 1, limit = 20, deleted = 0} = query
  const offset = (page - 1) * limit
  const params = {...query, offset, limit, deleted}

  const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&')

  const result = await request(`/bases-locales/search?${queryString}`)
  return result
}

export async function sync(balId, token) {
  try {
    const response = await request(`/bases-locales/${balId}/sync/exec`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    })
    toaster.success('La Base Adresses Nationale a bien été mise à jour !')
    return response
  } catch (error) {
    toaster.danger('Impossible de mettre à jour la Base Adresses Nationale', {
      duration: 30,
      description: error.message
    })
  }
}

export async function pauseSync(balId, token) {
  try {
    const response = await request(`/bases-locales/${balId}/sync/pause`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    })
    toaster.warning('Mise en pause des mises à jour automatiques de la Base Adresses Nationale')
    return response
  } catch (error) {
    toaster.danger('Impossible de suspendre la mise à jour de la Base Adresses Nationale', {
      description: error.message
    })
  }
}

export async function resumeSync(balId, token) {
  try {
    const response = await request(`/bases-locales/${balId}/sync/resume`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    })
    toaster.success('Reprise de la mise à jour automatique de la Base Adresses Nationale')
    return response
  } catch (error) {
    toaster.danger('Impossible de reprendre la mise à jour automatique de la Base Adresses Nationale', {
      description: error.message
    })
  }
}

export async function getBaseLocale(balId, token) {
  const headers = token ? {
    authorization: `Bearer ${token}`
  } : {}

  const bal = await request(`/bases-locales/${balId}`, {headers})

  return bal._deleted ? null : bal
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
  try {
    const response = await request(`/bases-locales/${balId}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    return response
  } catch (error) {
    toaster.danger('La Base Adresse Locale n’a pas pu être mise à jour', {
      description: error.message
    })
  }
}

export async function transformToDraft(balId, body, token) {
  return request(`/bases-locales/${balId}/transform-to-draft`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

export async function removeBaseLocale(balId, token) {
  try {
    const response = await request(`/bases-locales/${balId}`, {
      json: false,
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`
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
  console.log('file', file)
  return request(`/bases-locales/${balId}/upload`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'text/csv'
    },
    formData: {
      file
    },
    mediaType: 'multipart/form-data',
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

export function getListVoiesCsvUrl(balId) {
  return `${BAL_API_URL}/bases-locales/${balId}/voies/csv`
}

export function getParcelles(balId) {
  return request(`/bases-locales/${balId}/parcelles`)
}

export function getCommuneGeoJson(balId) {
  return request(`/bases-locales/${balId}/geojson`)
}

export function populateCommune(balId, token) {
  return request(`/bases-locales/${balId}/populate`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`
    }
  })
}

export function getVoies(balId) {
  return request(`/bases-locales/${balId}/voies`)
}

export function getVoie(idVoie) {
  return request(`/voies/${idVoie}`)
}

export async function addVoie(balId, body, token) {
  return editRequest(`/bases-locales/${balId}/voies`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      ...body,
      nom: trimStart(trimEnd(body.nom))
    })
  },
  'La voie a bien été ajoutée',
  'La voie n’a pas pu être ajoutée'
  )
}

export async function editVoie(idVoie, body, token) {
  return editRequest(`/voies/${idVoie}`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  },
  'La voie a bien été modifiée',
  'La voie n’a pas pu être modifiée'
  )
}

export async function softRemoveVoie(idVoie, token) {
  return editRequest(`/voies/${idVoie}/soft-delete`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
  },
  'La voie a bien été archivée',
  'La voie n’a pas pu être archivée'
  )
}

export async function removeVoie(idVoie, token) {
  try {
    const response = await request(`/voies/${idVoie}`, {
      json: false,
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`
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

export async function restoreVoie(idVoie, body, token) {
  return editRequest(`/voies/${idVoie}/restore`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  },
  'La voie a bien été restaurée',
  'La voie n’a pas pu être restaurée'
  )
}

export async function convertVoieToToponyme(idVoie, token) {
  try {
    const response = await request(`/voies/${idVoie}/convert-to-toponyme`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
    })
    toaster.success('La voie a bien été convertie en toponyme')
    return response
  } catch (error) {
    toaster.danger('La voie n’a pas pu être convertie en toponyme', {
      description: error.message
    })
    return {error}
  }
}

export function getToponymes(balId) {
  return request(`/bases-locales/${balId}/toponymes`)
}

export function getToponyme(idToponyme) {
  return request(`/toponymes/${idToponyme}`)
}

export async function addToponyme(balId, body, token) {
  return editRequest(`/bases-locales/${balId}/toponymes`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  },
  'Le toponyme a bien été ajouté',
  'Le toponyme n’a pas pu être ajouté'
  )
}

export async function editToponyme(idToponyme, body, token) {
  return editRequest(`/toponymes/${idToponyme}`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  },
  'Le toponyme a bien été modifé',
  'Le toponyme n’a pas pu être modifié'
  )
}

export async function softRemoveToponyme(idToponyme, token) {
  return editRequest(`/toponymes/${idToponyme}/soft-delete`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
  },
  'Le toponyme a bien été archivé',
  'Le toponyme n’a pas pu être archivé'
  )
}

export async function removeToponyme(idToponyme, token) {
  try {
    const response = await request(`/toponymes/${idToponyme}`, {
      json: false,
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`
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

export async function restoreToponyme(idVoie, token) {
  return editRequest(`/toponymes/${idVoie}/restore`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
  },
  'Le toponyme a bien été restaurée',
  'Le toponyme n’a pas pu être restaurée'
  )
}

export function getNumerosToponyme(idToponyme, token) {
  const headers = token ? {
    authorization: `Bearer ${token}`
  } : {}

  return request(`/toponymes/${idToponyme}/numeros`, {headers})
}

export function getNumeros(idVoie, token) {
  const headers = token ? {
    authorization: `Bearer ${token}`
  } : {}
  return request(`/voies/${idVoie}/numeros`, {headers})
}

export async function addNumero(idVoie, body, token) {
  return editRequest(`/voies/${idVoie}/numeros`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  },
  'Le numéro a bien été ajouté',
  'Le numéro n’a pas pu être ajouté'
  )
}

export async function editNumero(idNumero, body, token) {
  return editRequest(`/numeros/${idNumero}`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  },
  'Le numéro a bien été modifié',
  'Le numéro n’a pas pu être modifié'
  )
}

export function certifyBAL(balId, token, changes) {
  return request(`/bases-locales/${balId}/numeros/batch`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({changes})
  })
}

export function batchNumeros(balId, body, token) {
  try {
    const response = request(`/bases-locales/${balId}/numeros/batch`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    toaster.success('Les numéros ont bien été modifiés')
    return response
  } catch (error) {
    toaster.danger('Les numéros n’ont pas pu être modifiés', {
      description: error.message
    })

    return error
  }
}

export async function softRemoveNumero(idNumero, token) {
  return editRequest(`/numeros/${idNumero}/soft-delete`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
  },
  'Le numéro a bien été archivé',
  'Le numéro n’a pas pu être archivé'
  )
}

export async function removeNumero(idNumero, token) {
  try {
    const response = await request(`/numeros/${idNumero}`, {
      json: false,
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    toaster.success('Le numéro a bien été supprimé')

    return response
  } catch (error) {
    toaster.danger('Le numéro n’a pas pu être supprimé', {
      description: error.message
    })

    return error
  }
}

export async function removeMultipleNumeros(balId, body, token) {
  try {
    const response = await request(`/bases-locales/${balId}/numeros/batch`, {
      json: false,
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })
    toaster.success('Les numéros ont bien été archivés')
    return response
  } catch (error) {
    toaster.danger('Les numéros n’ont pas pu être archivés', {
      description: error.message
    })

    return error
  }
}

export async function softRemoveMultipleNumero(balId, body, token) {
  return editRequest(`/bases-locales/${balId}/numeros/batch/soft-delete`, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  },
  'Les numéros ont bien été archivés',
  'Les numéros n’ont pas pu être archivés'
  )
}

export function renewToken(balId, token) {
  return request(`/bases-locales/${balId}/token/renew`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    }
  })
}

export function getContoursCommunes() {
  return request('/stats/couverture-bal')
}

export async function getCommuneExtras(codeCommune) {
  return request(`/commune/${codeCommune}`)
}

export function getAllDeleted(balId) {
  return request(`/bases-locales/${balId}/all/deleted`)
}
