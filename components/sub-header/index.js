import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

import {getBaseLocaleCsvUrl, updateBaseLocale} from '../../lib/bal-api'

import BalDataContext from '../../contexts/bal-data'
import TokenContext from '../../contexts/token'

import useError from '../../hooks/error'

import Breadcrumbs from '../breadcrumbs'
import HabilitationTag from '../habilitation-tag'

import SettingsMenu from './settings-menu'
import Publication from './publication'
import DemoWarning from './demo-warning'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'https://adresse.data.gouv.fr'
const EDITEUR_URL = process.env.NEXT_PUBLIC_EDITEUR_URL || 'https://mes-adresses.data.gouv.fr'

const SubHeader = React.memo(({initialBaseLocale, commune, voie, toponyme}) => {
  const balDataContext = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  const [setError] = useError(null)

  const csvUrl = getBaseLocaleCsvUrl(initialBaseLocale._id)
  const baseLocale = balDataContext.baseLocale || initialBaseLocale
  const isEntitled = baseLocale.habilitation && baseLocale.habilitation.status === 'accepted'

  const handleChangeStatus = async () => {
    try {
      const newStatus = baseLocale.status === 'draft' ? 'ready-to-publish' : 'draft'
      await updateBaseLocale(initialBaseLocale._id, {status: newStatus}, token)

      await balDataContext.reloadBaseLocale()
    } catch (error) {
      setError(error.message)
    }
  }

  const handlePublication = async () => {
    try {
      await updateBaseLocale(initialBaseLocale._id, {status: 'ready-to-publish'}, token)
      const redirectUrl = `${EDITEUR_URL}/bal/${baseLocale._id}/communes/${commune.code}`
      window.location.href = `${ADRESSE_URL}/bases-locales/publication?url=${encodeURIComponent(csvUrl)}&redirectUrl=${encodeURIComponent(redirectUrl)}`
    } catch (error) {
      setError(error.message)
    }
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
          <SettingsMenu isAdmin={Boolean(token)} csvUrl={csvUrl} />

          {baseLocale.status !== 'demo' && commune && (
            <Publication
              border
              token={token}
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
  toponyme: PropTypes.object
}

SubHeader.defaultProps = {
  commune: null,
  voie: null,
  toponyme: null
}

export default SubHeader
