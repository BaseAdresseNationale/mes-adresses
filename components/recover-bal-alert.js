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

function RecoverBALAlert() {
  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, onEmailChange, resetEmail] = useInput()

  const handleClick = () => {
    setIsShown(true)
  }

  const handleComplete = () => {
    setIsShown(false)
    setIsLoading(false)
  }

  const handleConfirm = useCallback(() => {
    setIsLoading(true)

    recoverBAL(email)
    toaster.success(`Un email a été envoyé à l’adresse ${email}`)
    resetEmail()

    setIsLoading(false)
    setIsShown(false)
  }, [email, resetEmail])

  return (
    <>
      <Dialog
        isShown={isShown}
        title='Récupération de mes Bases Adresse Locales'
        cancelLabel='Annuler'
        isConfirmLoading={isLoading}
        isConfirmDisabled={!validateEmail(email)}
        confirmLabel={isLoading ? 'Chargement...' : 'Confirmer ma demande'}
        onCloseComplete={() => handleComplete()}
        onConfirm={() => handleConfirm()}
      >
        <Label display='block' marginBottom={4}>
          Adresse email
        </Label>
        <TextInput
          display='block'
          type='email'
          width='100%'
          placeholder='Renseignez votre adresse email…'
          maxWidth={400}
          value={email}
          onChange={onEmailChange}
        />
      </Dialog>

      <Pane padding='22px'>
        <Alert>
          <Text>
            Vous ne retrouvez pas vos Bases Adresse Locales ? Pour les récupérer par courriel
          </Text>
          <Button appearance='primary' marginLeft='1em' onClick={() => handleClick()}>Cliquez ici</Button>
        </Alert>
      </Pane>
    </>
  )
}

export default RecoverBALAlert
