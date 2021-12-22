import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import {createHabilitation, getBaseLocaleCsvUrl, sync, updateBaseLocale} from '../../lib/bal-api'

import BalDataContext from '../../contexts/bal-data'
import TokenContext from '../../contexts/token'

import useError from '../../hooks/error'

import HabilitationProcess from '../habilitation-process/index'

import Breadcrumbs from '../breadcrumbs'
import HabilitationTag from '../habilitation-tag'

import SettingsMenu from './settings-menu'
import DemoWarning from './demo-warning'
import BALStatus from './bal-status'

const SubHeader = React.memo(({initialBaseLocale, commune, voie, toponyme, isFranceConnectAuthentication}) => {
  const [isHabilitationDisplayed, setIsHabilitationDisplayed] = useState(isFranceConnectAuthentication)

  const balDataContext = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  const [setError] = useError(null)

  const csvUrl = getBaseLocaleCsvUrl(initialBaseLocale._id)
  const baseLocale = balDataContext.baseLocale || initialBaseLocale
  const isEntitled = balDataContext.habilitation && balDataContext.habilitation.status === 'accepted'
  const isAdmin = Boolean(token)

  const handleChangeStatus = async status => {
    try {
      await updateBaseLocale(initialBaseLocale._id, {status}, token)

      await balDataContext.reloadBaseLocale()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleHabilitation = async () => {
    await handleChangeStatus('ready-to-publish')

    if (!balDataContext.habilitation || balDataContext.habilitation.status === 'rejected') {
      await createHabilitation(token, initialBaseLocale._id)
      await balDataContext.reloadHabilitation()
    }

    setIsHabilitationDisplayed(true)
  }

  const handleCloseHabilitation = () => {
    setIsHabilitationDisplayed(false)
  }

  const handleSync = async () => {
    await sync(baseLocale._id, token)
    await balDataContext.reloadBaseLocale()
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
        {isEntitled && commune && <HabilitationTag communeName={commune.nom} />}

        <Breadcrumbs
          baseLocale={baseLocale}
          commune={commune}
          voie={balDataContext.voie || voie}
          toponyme={balDataContext.toponyme || toponyme}
          marginLeft={8}
        />

        <Pane marginLeft='auto' display='flex' alignItems='center'>
          <SettingsMenu isAdmin={isAdmin} csvUrl={csvUrl} />
          {commune && (
            <BALStatus
              baseLocale={baseLocale}
              codeCommune={commune.code}
              token={token}
              handleChangeStatus={handleChangeStatus}
              handleHabilitation={handleHabilitation}
              reloadBaseLocale={async () => balDataContext.reloadBaseLocale()}
            />
          )}
        </Pane>
      </Pane>

      {baseLocale.status === 'demo' && (
        <DemoWarning baseLocale={baseLocale} token={token} />
      )}

      {isAdmin && commune && balDataContext.habilitation && (
        <HabilitationProcess
          token={token}
          isShown={isHabilitationDisplayed}
          baseLocale={baseLocale}
          commune={commune}
          habilitation={balDataContext.habilitation}
          resetHabilitationProcess={handleHabilitation}
          handleClose={handleCloseHabilitation}
          handleSync={handleSync}
        />
      )}
    </>
  )
})

SubHeader.propTypes = {
  initialBaseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['demo', 'draft', 'ready-to-publish', 'published'])
  }).isRequired,
  commune: PropTypes.object,
  voie: PropTypes.object,
  toponyme: PropTypes.object,
  isFranceConnectAuthentication: PropTypes.bool
}

SubHeader.defaultProps = {
  commune: null,
  voie: null,
  toponyme: null,
  isFranceConnectAuthentication: false
}

export default SubHeader
