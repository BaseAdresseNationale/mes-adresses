import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Pane} from 'evergreen-ui'

import {createHabilitation, getBaseLocaleCsvUrl, sync, updateBaseLocale} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import HabilitationProcess from '@/components/habilitation-process/index'
import Breadcrumbs from '@/components/breadcrumbs'
import HabilitationTag from '@/components/habilitation-tag'
import COMDialog from '@/components/habilitation-process/com-dialog'
import SettingsMenu from '@/components/sub-header/settings-menu'
import BALStatus from '@/components/sub-header/bal-status'

const SubHeader = React.memo(({commune}) => {
  const {query} = useRouter()
  const [isHabilitationDisplayed, setIsHabilitationDisplayed] = useState(query['france-connect'] === '1')

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

  const handleChangeStatus = async status => {
    const updated = await updateBaseLocale(baseLocale._id, {status}, token)
    await reloadBaseLocale()

    return updated
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

  return (
    <>
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
          handleSync={handleSync}
        />
      )}
    </>
  )
})

SubHeader.propTypes = {
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    isCOM: PropTypes.bool.isRequired
  }).isRequired
}

export default SubHeader
