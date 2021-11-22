import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Dialog, Pane, toaster} from 'evergreen-ui'

import {createHabilitation, getBaseLocaleCsvUrl, updateBaseLocale} from '../../lib/bal-api'

import BalDataContext from '../../contexts/bal-data'
import TokenContext from '../../contexts/token'

import useError from '../../hooks/error'

import HabilitationProcess from '../habilitation-process/index'

import Breadcrumbs from '../breadcrumbs'
import HabilitationTag from '../habilitation-tag'
import ReadyToPublishDialog from '../ready-to-publish-dialog'

import SettingsMenu from './settings-menu'
import Publication from './publication'
import DemoWarning from './demo-warning'

const SubHeader = React.memo(({initialBaseLocale, commune, voie, toponyme, isFranceConnectAuthentication}) => {
  const [isHabilitationDisplayed, setIsHabilitationDisplayed] = useState(isFranceConnectAuthentication)
  const [isReadyToPublish, setIsReadyToPublish] = useState(false)

  const balDataContext = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  const [setError] = useError(null)

  const csvUrl = getBaseLocaleCsvUrl(initialBaseLocale._id)
  const baseLocale = balDataContext.baseLocale || initialBaseLocale
  const isEntitled = balDataContext.habilitation && balDataContext.habilitation.status === 'accepted'
  const isAdmin = Boolean(token)

  const handleChangeStatus = async () => {
    try {
      const newStatus = baseLocale.status === 'draft' ? 'ready-to-publish' : 'draft'
      await updateBaseLocale(initialBaseLocale._id, {status: newStatus}, token)

      await balDataContext.reloadBaseLocale()
    } catch (error) {
      setError(error.message)
    }
  }

  const startHabilitation = async () => {
    if (!balDataContext.habilitation || balDataContext.habilitation.status === 'rejected') {
      await createHabilitation(token, initialBaseLocale._id)
      await balDataContext.reloadHabilitation()
    }

    setIsHabilitationDisplayed(true)
  }

  const handlePublication = async () => {
    if (isEntitled) {
      setIsReadyToPublish(true)
    } else {
      await startHabilitation()
    }
  }

  const handleCloseHabilitation = () => {
    setIsHabilitationDisplayed(false)
    setIsReadyToPublish(balDataContext.habilitation.status === 'accepted')
  }

  const handlePublish = () => {
    setIsReadyToPublish(false)
    toaster.success('Votre Base Adresses Locale est publiée !')
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
        {isEntitled && <HabilitationTag communeName={commune.nom} />}

        <Breadcrumbs
          baseLocale={baseLocale}
          commune={commune}
          voie={balDataContext.voie || voie}
          toponyme={balDataContext.toponyme || toponyme}
          marginLeft={8}
        />

        <Pane marginLeft='auto' display='flex' alignItems='center'>
          <SettingsMenu isAdmin={isAdmin} csvUrl={csvUrl} />

          {baseLocale.status !== 'demo' && commune && (
            <Publication
              border
              isAdmin={isAdmin}
              baseLocale={baseLocale}
              commune={commune}
              status={baseLocale.status}
              onChangeStatus={handleChangeStatus}
              onPublish={handlePublication}
            />)}
        </Pane>
      </Pane>

      {baseLocale.status === 'demo' && (
        <DemoWarning baseLocale={baseLocale} token={token} />
      )}

      {isAdmin && balDataContext.habilitation && (
        <HabilitationProcess
          token={token}
          isShown={isHabilitationDisplayed}
          baseLocale={baseLocale}
          commune={commune}
          habilitation={balDataContext.habilitation}
          resetHabilitationProcess={startHabilitation}
          handleClose={handleCloseHabilitation}
        />
      )}

      {balDataContext.habilitation && (
        <Dialog
          isShown={isReadyToPublish}
          title='Publier vos adresses'
          confirmLabel='Publier'
          cancelLabel='Annuler'
          onConfirm={handlePublish}
          onCloseComplete={() => setIsReadyToPublish(false)}
        >
          <ReadyToPublishDialog baseLocaleId={baseLocale._id} codeCommune={commune.code} />
        </Dialog>
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
