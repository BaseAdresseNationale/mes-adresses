import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Pane, toaster} from 'evergreen-ui'

import {createHabilitation, getBaseLocaleCsvUrl, sync, updateBaseLocale} from '@/lib/bal-api'
import {getBANCommune} from '@/lib/api-ban'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import HabilitationProcess from '@/components/habilitation-process/index'
import Breadcrumbs from '@/components/breadcrumbs'
import HabilitationTag from '@/components/habilitation-tag'
import COMDialog from '@/components/habilitation-process/com-dialog'
import SettingsMenu from '@/components/sub-header/settings-menu'
import BALStatus from '@/components/sub-header/bal-status'
import MassDeletionDialog from '@/components/mass-deletion-dialog'

const SubHeader = React.memo(({commune}) => {
  const {query} = useRouter()
  const [isHabilitationDisplayed, setIsHabilitationDisplayed] = useState(query['france-connect'] === '1')
  const [massDeletionConfirm, setMassDeletionConfirm] = useState()

  const {
    baseLocale,
    habilitation,
    reloadBaseLocale,
    reloadHabilitation,
    isHabilitationValid,
    voie,
    toponyme,
    isRefrehSyncStat
  } = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  const csvUrl = getBaseLocaleCsvUrl(baseLocale._id)
  const isAdmin = Boolean(token)

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

  const updateStatus = async status => {
    const updated = await updateBaseLocale(baseLocale._id, {status}, token)
    await reloadBaseLocale()

    return updated
  }

  const handleChangeStatus = async status => {
    const isMassDeletionDetected = await checkMassDeletion()
    if (status === 'ready-to-publish' && isMassDeletionDetected) {
      setMassDeletionConfirm(() => (async () => {
        const updated = await updateStatus(status)
        setIsHabilitationDisplayed(updated)
      }))
    } else {
      return updateStatus(status)
    }
  }

  const handleHabilitation = async () => {
    let isReadyToPublish = ['published', 'ready-to-publish', 'replaced'].includes(baseLocale.status)

    if (baseLocale.status === 'draft') {
      const updated = await handleChangeStatus('ready-to-publish')
      isReadyToPublish = Boolean(updated)
    }

    if (isReadyToPublish && (!habilitation || !isHabilitationValid) && !commune.isCOM) {
      const habilitation = await createHabilitation(token, baseLocale._id)

      if (habilitation) {
        await reloadHabilitation()
      }
    }

    setIsHabilitationDisplayed(isReadyToPublish)
  }

  const handleCloseHabilitation = () => {
    setIsHabilitationDisplayed(false)
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

  return (
    <>
      <MassDeletionDialog
        isShown={Boolean(massDeletionConfirm)}
        handleConfirm={massDeletionConfirm}
        handleCancel={() => setMassDeletionConfirm(null)}
        onClose={() => setMassDeletionConfirm(null)}
      />

      <Pane
        position='fixed'
        top={76}
        left={0}
        height={40}
        width='100%'
        background='tint1'
        elevation={0}
        zIndex={3}
        display='flex'
        alignItems='center'
        padding={8}
      >
        {isHabilitationValid && <HabilitationTag communeName={commune.nom} />}

        <Breadcrumbs
          baseLocale={baseLocale}
          commune={commune}
          voie={voie}
          toponyme={toponyme}
          marginLeft={8}
        />

        <Pane marginLeft='auto' display='flex' alignItems='center'>
          <SettingsMenu isAdmin={isAdmin} csvUrl={csvUrl} />
          <BALStatus
            baseLocale={baseLocale}
            commune={commune}
            token={token}
            isHabilitationValid={isHabilitationValid}
            isRefrehSyncStat={isRefrehSyncStat}
            handlePublication={handlePublication}
            handleChangeStatus={handleChangeStatus}
            handleHabilitation={handleHabilitation}
            reloadBaseLocale={async () => reloadBaseLocale()}
          />
        </Pane>
      </Pane>

      {isAdmin && isHabilitationDisplayed && commune.isCOM && (
        <COMDialog baseLocaleId={baseLocale._id} handleClose={handleCloseHabilitation} />
      )}

      {isAdmin && habilitation && isHabilitationDisplayed && !commune.isCOM && (
        <HabilitationProcess
          token={token}
          baseLocale={baseLocale}
          commune={commune}
          habilitation={habilitation}
          resetHabilitationProcess={handleHabilitation}
          handleClose={handleCloseHabilitation}
          handlePublication={handlePublication}
        />
      )}
    </>
  )
})

SubHeader.propTypes = {
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    isCOM: PropTypes.bool.isRequired
  }).isRequired
}

export default SubHeader
