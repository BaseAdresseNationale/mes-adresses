import {useState, useCallback, useEffect} from 'react'
import {toaster} from 'evergreen-ui'

import {getHabilitation} from '@/lib/bal-api'

export default function useHabilitation(baseLocaleId, token) {
  const [habilitation, setHabilitation] = useState(null)
  const [isValid, setIsValid] = useState(false)

  const reloadHabilitation = useCallback(async () => {
    if (token) {
      try {
        const habilitation = await getHabilitation(token, baseLocaleId)
        setHabilitation(habilitation)
      } catch {
        setHabilitation(null)
      }
    }
  }, [baseLocaleId, token])

  useEffect(() => {
    if (habilitation) {
      let isExpired = null
      if (habilitation.expiresAt) {
        const expiresAt = new Date(habilitation.expiresAt)
        isExpired = expiresAt < new Date()
        if (isExpired) {
          toaster.danger('L’habilitaton est expirée', {
            description: 'Les prochaines modifications ne seront pas prises en compte dans la Base Adresses Nationale. Cliquer sur "Publier" pour renouveler l’habilitation.',
            duration: 10
          })
        }
      }

      const isRejected = habilitation.status === 'rejected'
      const isValid = isExpired === false && !isRejected
      setIsValid(isValid)
    }
  }, [habilitation])

  useEffect(() => {
    reloadHabilitation()
  }, [token, reloadHabilitation])

  return [habilitation, reloadHabilitation, isValid]
}
