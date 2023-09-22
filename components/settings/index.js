import {useState} from 'react'
import PropTypes from 'prop-types'
import {
  Pane,
  Heading,
  Tablist,
  Tab,
  CogIcon
} from 'evergreen-ui'

import UserSettingsForm from './user-settings-form'
import BALSettingsForm from './bal-settings-form'

const getSettingsTabs = hideBalSettings => {
  const tabs = [{
    key: 'bal-settings',
    label: 'Paramètres de la Base Adresse Locale'
  }, {
    key: 'user-preferences',
    label: 'Préférences utilisateurs'
  }]
  // Only show user preferences if the user is not an admin
  if (hideBalSettings) {
    tabs.shift()
  }

  return tabs
}

function Settings({baseLocale, isAdmin}) {
  const hideBalSettings = baseLocale.status === 'demo' || !isAdmin
  const avalaibleTabs = getSettingsTabs(hideBalSettings)
  const [selectedTabKey, setSelectedTabKey] = useState(avalaibleTabs[0].key)

  return (
    <Pane height='100%' display='flex' flexDirection='column'>
      <Pane
        flexShrink={0}
        elevation={0}
        background='white'
        padding={16}
        display='flex'
        alignItems='center'
        minHeight={64}
      >
        <Pane display='flex' alignItems='center'>
          <CogIcon />
          <Heading paddingLeft={5}>Paramètres</Heading>
        </Pane>
      </Pane>

      <Tablist padding={5}>
        {avalaibleTabs.map(
          ({key, label}) => (
            <Tab
              key={key}
              isSelected={selectedTabKey === key}
              onSelect={() => setSelectedTabKey(key)}
            >
              {label}
            </Tab>
          )
        )}
      </Tablist>

      <Pane
        display='flex'
        flexGrow={1}
        flexDirection='column'
        overflowY='scroll'
      >
        {selectedTabKey === 'bal-settings' && (
          <BALSettingsForm baseLocale={baseLocale} />
        )}
        {selectedTabKey === 'user-preferences' && (
          <UserSettingsForm baseLocale={baseLocale} />
        )}
      </Pane>
    </Pane>
  )
}

Settings.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired
}

export default Settings
