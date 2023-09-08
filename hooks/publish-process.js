import {useState, useContext} from 'react'
import {toaster} from 'evergreen-ui'

import {createHabilitation, sync, updateBaseLocale} from '@/lib/bal-api'
import {getBANCommune} from '@/lib/api-ban'
import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

export default function usePublishProcess(commune) {
  const [massDeletionConfirm, setMassDeletionConfirm] = useState()

  const {
    baseLocale,
    habilitation,
    reloadBaseLocale,
    reloadHabilitation,
    isHabilitationValid,
    setIsHabilitationProcessDisplayed
  } = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  const checkMassDeletion = async () => {
    try {
      const communeBAN = await getBANCommune(commune.code)
      return (baseLocale.nbNumeros / communeBAN.nbNumeros) * 100 <= 50
    } catch (error) {
      toaster.danger('Impossible de récupérer les données de la Base Adresse Nationale', {
        description: error
      })

      return false
    }
  }

  const handleChangeStatus = async status => {
    const updated = await updateBaseLocale(baseLocale._id, {status}, token)
    await reloadBaseLocale()

    return updated
  }

  const handleShowHabilitationProcess = async () => {
    const isReadyToPublish = ['draft', 'published', 'ready-to-publish', 'replaced'].includes(baseLocale.status)

    if (isReadyToPublish && (!habilitation || !isHabilitationValid) && !commune.isCOM) {
      const habilitation = await createHabilitation(token, baseLocale._id)

      if (habilitation) {
        await reloadHabilitation()
      }
    }

    setIsHabilitationProcessDisplayed(isReadyToPublish)
  }

  const handleSync = async () => {
    await sync(baseLocale._id, token)
    await reloadBaseLocale()
  }

  const handlePublication = async () => {
    const isMassDeletionDetected = await checkMassDeletion()

    if (isMassDeletionDetected) {
      setMassDeletionConfirm(() => handleSync)
    } else {
      await handleSync()
    }
  }

  return {
    massDeletionConfirm,
    setMassDeletionConfirm,
    handleChangeStatus,
    handleShowHabilitationProcess,
    handlePublication
  }
}
