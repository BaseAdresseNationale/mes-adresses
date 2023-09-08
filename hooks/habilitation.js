import {useState, useCallback, useEffect} from 'react'
import {toaster} from 'evergreen-ui'
import {useRouter} from 'next/router'

import {getHabilitation} from '@/lib/bal-api'

export default function useHabilitation(baseLocale, token) {
  const {query} = useRouter()
  const [habilitation, setHabilitation] = useState(null)
  const [isHabilitationProcessDisplayed, setIsHabilitationProcessDisplayed] = useState(query['france-connect'] === '1')
  const [habilitationStatus, setHabilitationStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const computeHabilitationStatus = habilitation => {
    let status = null
    const isAccepted = habilitation.status === 'accepted'
    const isExpired = new Date(habilitation.expiresAt) < new Date()
    const isHabilitationValid = isAccepted && !isExpired
    const isBALSynced = Boolean(baseLocale.sync)
    // We want to display the toaster only if the habilitation is not accepted or expired
    // and not repeat it during the habilitation process when the user creates a new habilitation not accepted yet
    const canDisplayToaster = habilitationStatus !== 'not-accepted' && habilitationStatus !== 'expired'

    if (isBALSynced && !isAccepted) {
      status = 'not-accepted'
      if (canDisplayToaster) {
        toaster.danger('Aucune habilitation valide trouvée', {
          description: 'Les prochaines modifications ne seront pas prises en compte dans la Base Adresse Nationale. Cliquez sur "Habiliter la Base Adresse Locale" pour renouveler l’habilitation.',
          duration: 10
        })
      }
    } else if (isBALSynced && isExpired) {
      status = 'expired'
      if (canDisplayToaster) {
        toaster.danger('L’habilitaton est expirée', {
          description: 'Les prochaines modifications ne seront pas prises en compte dans la Base Adresse Nationale. Cliquez sur "Habiliter la Base Adresse Locale" pour renouveler l’habilitation.',
          duration: 10
        })
      }
    } else if (isHabilitationValid) {
      status = 'valid'
    } else {
      status = 'invalid'
    }

    setHabilitationStatus(status)
  }

  const reloadHabilitation = useCallback(async () => {
    if (token) {
      try {
        const habilitation = await getHabilitation(token, baseLocale._id)
        setHabilitation(habilitation)
      } catch {
        toaster.danger('Aucune habilitation trouvée', {
          description: 'Cliquez sur "Publier" pour demander une habilitation.',
          duration: 10
        })
        setHabilitationStatus('not-found')
        setHabilitation(null)
      }
    }
  }, [baseLocale._id, token])

  useEffect(() => {
    async function handleReloadHabilitation() {
      setIsLoading(true)
      await reloadHabilitation()
      setIsLoading(false)
    }

    handleReloadHabilitation()
  }, [token, reloadHabilitation])

  // Compute habilitation status on first load
  useEffect(() => {
    if (habilitation) {
      computeHabilitationStatus(habilitation)
    }
  }, [habilitation])

  return {
    habilitation,
    reloadHabilitation,
    isHabilitationValid: habilitationStatus === 'valid',
    habilitationStatus,
    isLoading,
    isHabilitationProcessDisplayed,
    setIsHabilitationProcessDisplayed
  }
}
