import React, {useState, useContext, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {SideSheet, Pane, Alert} from 'evergreen-ui'

import {getCommune} from '../lib/bal-api'

import SettingsContext from '../contexts/settings'
import BalDataContext from '../contexts/bal-data'

import Certification from './settings/certification'
import SettingsForm from './settings/settings-form'

const Settings = React.memo(({initialBaseLocale, codeCommune}) => {
  const {isSettingsDisplayed, setIsSettingsDisplayed} = useContext(SettingsContext)
  const balDataContext = useContext(BalDataContext)

  const baseLocale = balDataContext.baseLocale || initialBaseLocale

  const [commune, setCommune] = useState()

  const fetchCommune = useCallback(async () => {
    const commune = await getCommune(initialBaseLocale._id, codeCommune)
    setCommune(commune)
  }, [initialBaseLocale._id, codeCommune])

  useEffect(() => { // Update number of certified numeros when setting is open
    if (codeCommune) {
      fetchCommune()
    }
  }, [initialBaseLocale._id, codeCommune, isSettingsDisplayed, fetchCommune])

  return (
    <SideSheet
      isShown={isSettingsDisplayed}
      onCloseComplete={() => setIsSettingsDisplayed(false)}
    >
      <SettingsForm initialBaseLocale={initialBaseLocale} />

      <Pane borderBottom='1px solid #d8dae5' width='80%' marginY={16} marginX='auto' />

      <Pane padding={16}>
        {commune && (
          <Pane display='flex' justifyContent='center'>
            <Certification nbNumeros={commune.nbNumeros} nbNumerosCertifies={commune.nbNumerosCertifies} onSubmit={fetchCommune} />
          </Pane>
        )}
      </Pane>

      {baseLocale.status === 'demo' && (
        <Pane padding={16}>
          <Alert
            intent='none'
            title='Version d’essai de l’éditeur de base adresse locale'
            marginBottom={32}
          >
            Il est impossible de modifier les paramètres de la base adresse locale en version d’essai.
          </Alert>
        </Pane>
      )}
    </SideSheet>
  )
})

Settings.defaultProps = {
  codeCommune: null
}

Settings.propTypes = {
  initialBaseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  codeCommune: PropTypes.string
}

export default Settings
