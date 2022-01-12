import React, {useState, useContext, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {SideSheet, Pane, Alert} from 'evergreen-ui'

import {getCommune} from '@/lib/bal-api'

import SettingsContext from '@/contexts/settings'
import BalDataContext from '@/contexts/bal-data'

import Certification from '@/components/settings/certification'
import SettingsForm from '@/components/settings/settings-form'

const Settings = React.memo(({codeCommune}) => {
  const {isSettingsDisplayed, setIsSettingsDisplayed} = useContext(SettingsContext)
  const {baseLocale} = useContext(BalDataContext)

  const [commune, setCommune] = useState()

  const fetchCommune = useCallback(async () => {
    const commune = await getCommune(baseLocale._id, codeCommune)
    setCommune(commune)
  }, [baseLocale._id, codeCommune])

  useEffect(() => { // Update number of certified numeros when setting is open
    if (codeCommune) {
      fetchCommune()
    }
  }, [baseLocale._id, codeCommune, isSettingsDisplayed, fetchCommune])

  return (
    <SideSheet
      isShown={isSettingsDisplayed}
      onCloseComplete={() => setIsSettingsDisplayed(false)}
    >
      <SettingsForm baseLocale={baseLocale} />

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
  codeCommune: PropTypes.string
}

export default Settings
