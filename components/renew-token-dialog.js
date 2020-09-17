import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Dialog, Paragraph, Alert, toaster} from 'evergreen-ui'

import {renewToken} from '../lib/bal-api'

const RenewTokenDialog = ({token, baseLocaleId, isShown, setIsShown, setError}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = useCallback(async () => {
    setIsLoading(true)

    try {
      await renewToken(baseLocaleId, token)

      toaster.success('Les autorisations ont été renouvellé avec succès !')
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
    setIsShown(false)
  }, [baseLocaleId, token, setError, setIsShown])

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title='Renouvellement des autorisations'
        intent='success'
        cancelLabel='Annuler'
        confirmLabel='Valider'
        isConfirmLoading={isLoading}
        onConfirm={() => handleConfirm()}
        onCloseComplete={() => setIsShown(false)}
      >
        <Paragraph>Vous avez supprimé un ou plusieurs collaborateurs, souhaitez-vous procéder au renouvellement des autorisations ?</Paragraph>
        <Alert marginY={8} intent='warning'>
          Action irreversible, vous ne pourrez plus modifier la BAL sans récupérer la nouvelle autorisation que vous recevrez par courriel.
        </Alert>
      </Dialog>
    </Pane>
  )
}

RenewTokenDialog.propTypes = {
  token: PropTypes.string.isRequired,
  baseLocaleId: PropTypes.string.isRequired,
  isShown: PropTypes.bool.isRequired,
  setIsShown: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired
}

export default RenewTokenDialog
