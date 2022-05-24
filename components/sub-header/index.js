import React, {useState, useContext} from 'react'
import {useRouter} from 'next/router'
import {Pane} from 'evergreen-ui'

import {createHabilitation, getBaseLocaleCsvUrl, sync, updateBaseLocale} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useError from '@/hooks/error'

import HabilitationProcess from '@/components/habilitation-process/index'
import Breadcrumbs from '@/components/breadcrumbs'
import HabilitationTag from '@/components/habilitation-tag'
import SettingsMenu from '@/components/sub-header/settings-menu'
import DemoWarning from '@/components/sub-header/demo-warning'
import BALStatus from '@/components/sub-header/bal-status'

const SubHeader = React.memo(() => {
  const {query} = useRouter()
  const [isHabilitationDisplayed, setIsHabilitationDisplayed] = useState(query['france-connect'] === '1')

  const {
    baseLocale,
    habilitation,
    reloadBaseLocale,
    reloadHabilitation,
    isHabilitationValid,
    commune,
    voie,
    toponyme,
    isRefrehSyncStat
  } = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  const [setError] = useError(null)

  const csvUrl = getBaseLocaleCsvUrl(baseLocale._id)
  const isAdmin = Boolean(token)

  const handleChangeStatus = async status => {
    try {
      await updateBaseLocale(baseLocale._id, {status}, token)

      await reloadBaseLocale()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleHabilitation = async () => {
    if (baseLocale.status === 'draft') {
      await handleChangeStatus('ready-to-publish')
    }

    if (!habilitation || !isHabilitationValid) {
      await createHabilitation(token, baseLocale._id)
      await reloadHabilitation()
    }

    setIsHabilitationDisplayed(true)
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
        {isHabilitationValid && commune && <HabilitationTag communeName={commune.nom} />}

        <Breadcrumbs
          baseLocale={baseLocale}
          commune={commune}
          voie={voie}
          toponyme={toponyme}
          marginLeft={8}
        />

        <Pane marginLeft='auto' display='flex' alignItems='center'>
          <SettingsMenu isAdmin={isAdmin} csvUrl={csvUrl} />
          {commune && (
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
          )}
        </Pane>
      </Pane>

      {baseLocale.status === 'demo' && (
        <DemoWarning baseLocale={baseLocale} token={token} />
      )}

      {isAdmin && commune && habilitation && (
        <HabilitationProcess
          token={token}
          isShown={isHabilitationDisplayed}
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

export default SubHeader
