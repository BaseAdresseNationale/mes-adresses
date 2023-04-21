import {useState, useCallback, useEffect, useRef} from 'react'
import {toaster} from 'evergreen-ui'
import {useRouter} from 'next/router'

import {getHabilitation} from '@/lib/bal-api'

export default function useHabilitation(baseLocale, token) {
  const {query} = useRouter()
  const [habilitation, setHabilitation] = useState(null)
  const [isHabilitationProcessDisplayed, setIsHabilitationProcessDisplayed] = useState(query['france-connect'] === '1')
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isFirstLoad = useRef(true)

  const handleInvalidHabilitation = useCallback(habilitation => {
    if (habilitation) {
      const isAccepted = habilitation.status === 'accepted'
      const isExpired = new Date(habilitation.expiresAt) < new Date()

      if (baseLocale.sync && isFirstLoad.current) {
        if (!isAccepted) {
          toaster.danger('Aucune habilitation valide trouvée', {
            description: 'Les prochaines modifications ne seront pas prises en compte dans la Base Adresse Nationale. Cliquez sur "Publier" ou "Habiliter la Base Adresse Locale" pour renouveler l’habilitation.',
            duration: 10
          })
        } else if (isExpired) {
          toaster.danger('L’habilitaton est expirée', {
            description: 'Les prochaines modifications ne seront pas prises en compte dans la Base Adresse Nationale. Cliquez sur "Publier" ou "Habiliter la Base Adresse Locale" pour renouveler l’habilitation.',
            duration: 10
          })
        }

        isFirstLoad.current = false
      }

      setIsValid(isAccepted && !isExpired)
    } else {
      toaster.danger('Aucune habilitation trouvée', {
        description: 'Cliquez sur "Publier" pour demander une habilitation.',
        duration: 10
      })
      setIsValid(false)
    }
  }, [baseLocale.sync])

  const reloadHabilitation = useCallback(async () => {
    if (token) {
      try {
        const habilitation = await getHabilitation(token, baseLocale._id)
        setHabilitation(habilitation)
        handleInvalidHabilitation(habilitation)
      } catch {
        setHabilitation(null)
      }
    }
  }, [baseLocale._id, token, handleInvalidHabilitation])

  useEffect(() => {
    async function handleReloadHabilitation() {
      setIsLoading(true)
      await reloadHabilitation()
      setIsLoading(false)
    }

    handleReloadHabilitation()
  }, [token, reloadHabilitation])

  return [habilitation, reloadHabilitation, isValid, isLoading, isHabilitationProcessDisplayed, setIsHabilitationProcessDisplayed]
}
