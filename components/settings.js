import React, {useContext, useEffect} from 'react'
import {SideSheet, Pane, Alert} from 'evergreen-ui'

import SettingsContext from '@/contexts/settings'
import BalDataContext from '@/contexts/bal-data'

import Certification from '@/components/settings/certification'
import SettingsForm from '@/components/settings/settings-form'

const Settings = React.memo(() => {
  const {isSettingsDisplayed, setIsSettingsDisplayed} = useContext(SettingsContext)
  const {baseLocale, commune, reloadCommune} = useContext(BalDataContext)

  useEffect(() => { // Update number of certified numeros when setting is open
    if (isSettingsDisplayed) {
      reloadCommune()
    }
  }, [isSettingsDisplayed, reloadCommune])

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
            <Certification nbNumeros={commune.nbNumeros} nbNumerosCertifies={commune.nbNumerosCertifies} onSubmit={() => reloadCommune()} />
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

export default Settings
