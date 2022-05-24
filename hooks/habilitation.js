import {useState, useCallback, useEffect, useRef} from 'react'
import {toaster} from 'evergreen-ui'

import {getHabilitation} from '@/lib/bal-api'

export default function useHabilitation(baseLocale, token) {
  const [habilitation, setHabilitation] = useState(null)
  const [isValid, setIsValid] = useState(false)

  const isFirstLoad = useRef(true)

  const handleInvalidHabilitation = useCallback(habilitation => {
    let isValid = false

    if (baseLocale.sync) {
      if (!habilitation || habilitation.status !== 'accepted') {
        toaster.danger('Aucune habilitation valide trouvée', {
          description: 'Les prochaines modifications ne seront pas prises en compte dans la Base Adresse Nationale. Cliquez sur "Publier" pour renouveler l’habilitation.',
          duration: 10
        })
      } else if (habilitation?.expiresAt) {
        let isExpired = null
        const expiresAt = new Date(habilitation.expiresAt)
        isExpired = expiresAt < new Date()
        if (isExpired) {
          toaster.danger('L’habilitaton est expirée', {
            description: 'Les prochaines modifications ne seront pas prises en compte dans la Base Adresse Nationale. Cliquez sur "Publier" pour renouveler l’habilitation.',
            duration: 10
          })
        }

        isValid = isExpired === false
      } else {
        isValid = true
      }
    }

    setIsValid(isValid)
  }, [baseLocale.sync])

  const reloadHabilitation = useCallback(async () => {
    if (token) {
      try {
        const habilitation = await getHabilitation(token, baseLocale._id)
        setHabilitation(habilitation)

        if (isFirstLoad.current) {
          handleInvalidHabilitation(habilitation)
          isFirstLoad.current = false
        }
      } catch {
        setHabilitation(null)
      }
    }
  }, [baseLocale._id, token, handleInvalidHabilitation])

  useEffect(() => {
    reloadHabilitation()
  }, [token, reloadHabilitation])

  return [habilitation, reloadHabilitation, isValid]
}
