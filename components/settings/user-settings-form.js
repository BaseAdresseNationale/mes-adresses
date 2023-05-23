import {useContext, useState} from 'react'
import LocalStorageContext from '@/contexts/local-storage'
import PropTypes from 'prop-types'
import {
  Pane,
  Heading,
  Button,
  Checkbox,
  toaster
} from 'evergreen-ui'

import FormContainer from '@/components/form-container'
import FormInput from '@/components/form-input'

function UserSettings() {
  const {userSettings, setUserSettings} = useContext(LocalStorageContext)
  const [userSettingsForm, setUserSettingsForm] = useState(userSettings)

  const hasChanged = () => JSON.stringify(userSettingsForm) !== JSON.stringify(userSettings)

  const onSubmit = e => {
    e.preventDefault()
    setUserSettings(userSettingsForm)
    toaster.success('Les préférences utilisateurs ont été enregistrées avec succès !')
  }

  return (
    <Pane>
      <Pane
        flexShrink={0}
        elevation={0}
        background='white'
        padding={16}
        display='flex'
        alignItems='center'
        minHeight={64}
      >
        <Pane>
          <Heading>Préférences utilisateur</Heading>
        </Pane>
      </Pane>

      <Pane
        display='flex'
        flex={1}
        flexDirection='column'
        overflowY='scroll'
      >
        <FormContainer onSubmit={onSubmit}>
          <FormInput>
            <Checkbox
              name='colorblind-mode'
              id='colorblind-mode'
              label='Activer le mode daltonien'
              checked={userSettingsForm?.colorblindMode}
              onChange={() => setUserSettingsForm(settings => ({...settings, colorblindMode: !settings?.colorblindMode}))}
            />
          </FormInput>

          <Button height={40} marginTop={8} type='submit' appearance='primary' disabled={!hasChanged()}>
            Enregistrer les changements
          </Button>

        </FormContainer>
      </Pane>
    </Pane>
  )
}

UserSettings.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired
}

export default UserSettings
