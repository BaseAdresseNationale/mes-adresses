import React, {useContext} from 'react'
import {SideSheet, Pane, Alert} from 'evergreen-ui'

import SettingsContext from '@/contexts/settings'
import BalDataContext from '@/contexts/bal-data'

import SettingsForm from '@/components/settings/settings-form'

const Settings = React.memo(() => {
  const {isSettingsDisplayed, setIsSettingsDisplayed} = useContext(SettingsContext)
  const {baseLocale} = useContext(BalDataContext)

  return (
    <SideSheet
      isShown={isSettingsDisplayed}
      onCloseComplete={() => setIsSettingsDisplayed(false)}
    >
      <SettingsForm baseLocale={baseLocale} />

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
