import React, {useCallback, useState} from 'react'

import {
  Alert,
  Button,
  Dialog,
  Label,
  Pane,
  Text,
  TextInput,
  toaster
} from 'evergreen-ui'

import {recoverBAL} from '../lib/bal-api'
import {validateEmail} from '../lib/utils/email'
import {useInput} from '../hooks/input'

const hasBeenSentRecently = sentAt => {
  const now = new Date()

  const floodLimitTime = new Date(sentAt)
  floodLimitTime.setMinutes(floodLimitTime.getMinutes() + 5)
  return now < floodLimitTime
}

function RecoverBALAlert() {
  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailSentAt, setEmailSentAt] = useState(null)
  const [email, onEmailChange, resetEmail] = useInput('')

  const handleComplete = () => {
    setIsShown(false)
    setIsLoading(false)
  }

  const handleConfirm = useCallback(async () => {
    const now = new Date()
    const recoveryEmailSent = localStorage.getItem('recovery-email-sent')

    setIsLoading(true)

    if (hasBeenSentRecently(recoveryEmailSent) || hasBeenSentRecently(emailSentAt)) {
      setIsLoading(false)
      setIsShown(false)
      return toaster.warning('Un email a déjà été envoyé, merci de patienter.')
    }

    try {
      await recoverBAL(email)

      setEmailSentAt(now)
      localStorage.setItem('recovery-email-sent', now)
      toaster.success(`Un email a été envoyé à l’adresse ${email}`)
    } catch (error) {
      toaster.danger(error.message)
    }

    resetEmail()

    setIsLoading(false)
    setIsShown(false)
  }, [email, emailSentAt, resetEmail])

  return (
    <>
      <Dialog
        isShown={isShown}
        title='Demande de récupération de mes Bases Adresse Locales'
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
      </Dialog>

      <Pane padding={22}>
        <Alert>
          <Text>
            Vous ne retrouvez pas vos Bases Adresse Locales ? Pour les récupérer par courriel
          </Text>
          <Button appearance='primary' marginLeft='1em' onClick={() => setIsShown(true)}>Cliquez ici</Button>
        </Alert>
      </Pane>
    </>
  )
}

export default RecoverBALAlert
