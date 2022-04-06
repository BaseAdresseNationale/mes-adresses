import {useCallback, useState, useContext} from 'react'
import PropTypes from 'prop-types'
import {Dialog, Label, Paragraph, TextInput, toaster} from 'evergreen-ui'

import {recoverBAL} from '@/lib/bal-api'
import {validateEmail} from '@/lib/utils/email'

import LocalStorageContext from '@/contexts/local-storage'

import {useInput} from '@/hooks/input'

const hasBeenSentRecently = sentAt => {
  const now = new Date()

  const floodLimitTime = new Date(sentAt)
  floodLimitTime.setMinutes(floodLimitTime.getMinutes() + 5)
  return now < floodLimitTime
}

function RecoverBALAlert({isShown, defaultEmail, baseLocaleId, onClose}) {
  const {recoveryEmailSent, setRecoveryEmailSent} = useContext(LocalStorageContext)

  const [isLoading, setIsLoading] = useState(false)
  const [email, onEmailChange, resetEmail] = useInput(defaultEmail)

  const handleComplete = () => {
    setIsLoading(false)
    onClose()
  }

  const handleConfirm = useCallback(async () => {
    const now = new Date()

    setIsLoading(true)

    if (hasBeenSentRecently(recoveryEmailSent)) {
      setIsLoading(false)
      onClose()
      return toaster.warning('Un email a déjà été envoyé, merci de patienter.')
    }

    try {
      await recoverBAL(email, baseLocaleId)

      setRecoveryEmailSent(now)
      toaster.success(`Un email a été envoyé à l’adresse ${email}`)
    } catch (error) {
      toaster.danger(error.message)
    }

    resetEmail()

    setIsLoading(false)
    onClose()
  }, [email, baseLocaleId, recoveryEmailSent, resetEmail, onClose, setRecoveryEmailSent])

  return (
    <Dialog
      isShown={isShown}
      title={baseLocaleId ?
        'Récupération de votre Base Adresse Locale' :
        'Récupération de mes Bases Adresses Locales'}
      cancelLabel='Annuler'
      isConfirmLoading={isLoading}
      isConfirmDisabled={!validateEmail(email)}
      confirmLabel={isLoading ? 'Chargement...' : 'Recevoir le courriel'}
      onCloseComplete={() => handleComplete()}
      onConfirm={() => handleConfirm()}
    >
      <Label display='block' marginBottom={4}>
        Renseignez votre adresse de courrier électronique
      </Label>
      <TextInput
        display='block'
        type='email'
        width='100%'
        placeholder='adresse@courriel.fr'
        maxWidth={400}
        value={email}
        onChange={onEmailChange}
      />

      <Paragraph marginTop={16}>
        Un courrier électronique va être envoyé à l’adresse que vous avez renseignée.<br />{}
      </Paragraph>
      <Paragraph marginTop={8}>
        {baseLocaleId ?
          'Vous y retrouverez un lien d’administration de votre Base Adresse Locale. Il vous suffira alors de cliquer sur le lien afin de pouvoir la retrouver sur votre espace.' :
          'Vous y retrouverez la liste de toutes les Bases Adresses Locales associées à celle-ci. Il vous suffira alors de cliquer sur les liens qui y sont associés afin de pouvoir les retrouver sur votre espace.'}
      </Paragraph>
    </Dialog>
  )
}

RecoverBALAlert.defaultProps = {
  defaultEmail: '',
  baseLocaleId: null
}

RecoverBALAlert.propTypes = {
  isShown: PropTypes.bool.isRequired,
  defaultEmail: PropTypes.string,
  baseLocaleId: PropTypes.string,
  onClose: PropTypes.func.isRequired
}

export default RecoverBALAlert
