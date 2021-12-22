import {useState, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Dialog, Pane, Text, Spinner, toaster} from 'evergreen-ui'

const EDITEUR_URL = process.env.NEXT_PUBLIC_EDITEUR_URL || 'https://mes-adresses.data.gouv.fr'

import {sendAuthenticationCode, validateAuthenticationCode} from '../../lib/bal-api'

import BalDataContext from '../../contexts/bal-data'

import ValidateAuthentication from './validate-authentication'
import StrategySelection from './strategy-selection'
import AcceptedDialog from './accepted-dialog'
import RejectedDialog from './rejected-dialog'

function getStep(habilitation) {
  if (habilitation.status !== 'pending') {
    return 2
  }

  if (habilitation.strategy?.type === 'email') {
    return 1
  }

  return 0
}

function HabilitationProcess({isShown, token, baseLocale, commune, habilitation, handleSync, resetHabilitationProcess, handleClose}) {
  const [step, setStep] = useState(getStep(habilitation))
  const [isLoading, setIsLoading] = useState(false)

  const {reloadHabilitation} = useContext(BalDataContext)

  const sendCode = async () => {
    return sendAuthenticationCode(token, baseLocale, habilitation.emailCommune)
  }

  const redirectToFranceConnect = () => {
    const redirectUrl = encodeURIComponent(`${EDITEUR_URL}${Router.asPath}?france-connect=1`)
    Router.push(`${habilitation.franceconnectAuthenticationUrl}?redirectUrl=${redirectUrl}`)
  }

  const handleStrategy = async selectedStrategy => {
    setIsLoading(true)
    if (selectedStrategy === 'email') {
      try {
        await sendCode()
        setStep(1)
      } catch (error) {
        toaster.danger('Le courriel n’a pas pu être envoyé', {
          description: error.message
        })
      }
    }

    if (selectedStrategy === 'france-connect' && habilitation.franceconnectAuthenticationUrl) {
      redirectToFranceConnect()
    }

    setIsLoading(false)
  }

  const handleValidationCode = async code => {
    setIsLoading(true)
    const {status, validated, remainingAttempts} = await validateAuthenticationCode(token, baseLocale._id, code)

    if (!remainingAttempts) {
      // Habilitation rejected
      if (validated === 'false') {
        handleClose()
      }

      // Habilitation accepted
      if (status === 'accepted') {
        setStep(2)
      }

      await reloadHabilitation()
    }

    setIsLoading(false)
  }

  // Restart habilitation process, create new habilitation
  const handleReset = () => {
    setStep(0)
    resetHabilitationProcess()
  }

  const handleConfirm = () => {
    if (habilitation.status === 'accepted') {
      handleSync()
    }

    handleClose()
  }

  useEffect(() => {
    setStep(getStep(habilitation))
  }, [isShown, habilitation])

  return (
    <Dialog
      isShown={isShown}
      preventBodyScrolling
      hasHeader={false}
      intent='success'
      hasFooter={step === 2}
      hasCancel={step === 2 && habilitation.status === 'accepted'}
      width={1000}
      confirmLabel={habilitation.status === 'rejected' ? 'Fermer' : 'Publier'}
      cancelLabel='Attendre'
      onConfirm={handleConfirm}
      onCloseComplete={handleClose}
    >
      <Pane marginY={16}>
        {step === 0 && (
          <StrategySelection
            franceconnectAuthenticationUrl={habilitation.franceconnectAuthenticationUrl}
            emailCommune={habilitation.emailCommune}
            handleStrategy={handleStrategy}
          />
        )}

        {step === 1 && (
          <ValidateAuthentication
            emailCommune={habilitation.emailCommune}
            validatePinCode={handleValidationCode}
            resendCode={sendCode}
            onCancel={handleReset}
          />
        )}

        {step === 2 && habilitation.status === 'accepted' && (
          <AcceptedDialog
            {...habilitation}
            baseLocaleId={baseLocale._id}
            commune={commune}
          />
        )}

        {step === 2 && habilitation.status === 'rejected' && (
          <RejectedDialog communeName={commune.nom} strategyType={habilitation.strategy.type} />
        )}
      </Pane>

      {isLoading && (
        <Pane display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
          <Spinner size={42} />
          <Text fontStyle='italic'>Chargement…</Text>
        </Pane>
      )}
    </Dialog>

  )
}

HabilitationProcess.propTypes = {
  isShown: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  habilitation: PropTypes.shape({
    status: PropTypes.string.isRequired,
    emailCommune: PropTypes.string,
    franceconnectAuthenticationUrl: PropTypes.string.isRequired,
    strategy: PropTypes.shape({
      type: PropTypes.oneOf(['email', 'franceconnect'])
    }),
  }).isRequired,
  handleSync: PropTypes.func.isRequired,
  resetHabilitationProcess: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
}

export default HabilitationProcess
