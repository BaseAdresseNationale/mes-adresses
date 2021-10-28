import React, {useState, useContext, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {
  SideSheet,
  Pane,
  Heading,
  TextInputField,
  TextInput,
  IconButton,
  Button,
  Alert,
  Spinner,
  Label,
  toaster,
  DeleteIcon,
  AddIcon
} from 'evergreen-ui'
import {isEqual, difference} from 'lodash'

import {getCommune, updateBaseLocale} from '../lib/bal-api'

import TokenContext from '../contexts/token'

import {useInput} from '../hooks/input'
import SettingsContext from '../contexts/settings'
import {validateEmail} from '../lib/utils/email'
import BalDataContext from '../contexts/bal-data'

import Form from './form'
import FormInput from './form-input'
import RenewTokenDialog from './renew-token-dialog'
import Certification from './settings/certification'

const mailHasChanged = (listA, listB) => {
  return !isEqual([...listA].sort(), [...listB].sort())
}

const Settings = React.memo(({initialBaseLocale, codeCommune}) => {
  const {showSettings, setShowSettings} = useContext(SettingsContext)
  const {token, emails, reloadEmails} = useContext(TokenContext)
  const balDataContext = useContext(BalDataContext)

  const baseLocale = balDataContext.baseLocale || initialBaseLocale

  const [isLoading, setIsLoading] = useState(false)
  const [balEmails, setBalEmails] = useState([])
  const [nomInput, onNomInputChange] = useInput(baseLocale.nom)
  const [email, onEmailChange, resetEmail] = useInput()
  const [commune, setCommune] = useState()
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState()
  const [isRenewTokenWarningShown, setIsRenewTokenWarningShown] = useState(false)

  const formHasChanged = useCallback(() => {
    return nomInput !== baseLocale.nom ||
    mailHasChanged(emails || [], balEmails)
  }, [nomInput, baseLocale.nom, emails, balEmails])

  useEffect(() => {
    setBalEmails(emails || [])
  }, [emails])

  const onRemoveEmail = useCallback(email => {
    setBalEmails(emails => emails.filter(e => e !== email))
  }, [])

  const onAddEmail = useCallback(e => {
    e.preventDefault()

    if (validateEmail(email)) {
      setBalEmails(emails => [...emails, email])
      resetEmail()
    } else {
      setError('Cet email n’est pas valide')
    }
  }, [email, resetEmail])

  const onSubmit = useCallback(async e => {
    e.preventDefault()

    setError(null)
    setIsLoading(true)

    try {
      await updateBaseLocale(initialBaseLocale._id, {
        nom: nomInput.trim(),
        emails: balEmails
      }, token)

      await reloadEmails()
      await balDataContext.reloadBaseLocale()

      if (mailHasChanged(emails || [], balEmails) && difference(emails, balEmails).length !== 0) {
        setIsRenewTokenWarningShown(true)
      }

      toaster.success('La Base Adresse Locale a été modifiée avec succès !')
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
  }, [initialBaseLocale._id, nomInput, balEmails, token, reloadEmails, balDataContext, emails])

  const fetchCommune = useCallback(async () => {
    const commune = await getCommune(initialBaseLocale._id, codeCommune)
    setCommune(commune)
  }, [initialBaseLocale._id, codeCommune])

  useEffect(() => { // Update number of certified numeros when setting is open
    if (codeCommune) {
      fetchCommune()
    }
  }, [initialBaseLocale._id, codeCommune, showSettings, fetchCommune])

  useEffect(() => {
    if (error) {
      setError(null)
    }
  }, [email]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setHasChanges(formHasChanged())
  }, [formHasChanged])

  return (
    <SideSheet
      isShown={showSettings}
      onCloseComplete={() => setShowSettings(false)}
    >
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
          <Heading>Paramètres de la Base Adresse Locale</Heading>
        </Pane>
      </Pane>

      <Pane
        display='flex'
        flex={1}
        flexDirection='column'
        overflowY='scroll'
      >
        {token ? (
          <Form onFormSubmit={onSubmit}>
            <FormInput>
              <TextInputField
                required
                name='nom'
                id='nom'
                value={nomInput}
                maxWidth={600}
                disabled={isLoading || baseLocale.status === 'demo'}
                label='Nom'
                placeholder='Nom'
                onChange={onNomInputChange}
              />
            </FormInput>

            <FormInput>
              <Label display='block' marginBottom={4}>
                Adresses email
                {' '}
                <span title='This field is required.'>*</span>
              </Label>
              {balEmails.map(email => (
                <Pane key={email} display='flex' marginBottom={8}>
                  <TextInput
                    readOnly
                    disabled
                    type='email'
                    display='block'
                    width='100%'
                    maxWidth={400}
                    value={email}
                  />
                  {balEmails.length > 1 && (
                    <IconButton
                      type='button'
                      icon={DeleteIcon}
                      marginLeft={4}
                      appearance='minimal'
                      intent='danger'
                      onClick={() => onRemoveEmail(email)}
                    />
                  )}

                </Pane>

              ))}

              <Pane display='flex' marginBottom={16}>

                <TextInput
                  display='block'
                  type='email'
                  width='100%'
                  placeholder='Ajouter une adresse email…'
                  maxWidth={400}
                  isInvalid={Boolean(error && error.includes('mail'))}
                  value={email}
                  disabled={baseLocale.status === 'demo'}
                  onChange={onEmailChange}
                />
                {email && !balEmails.includes(email) && (
                  <IconButton
                    type='submit'
                    icon={AddIcon}
                    marginLeft={4}
                    disabled={!email}
                    appearance='minimal'
                    intent='default'
                    onClick={onAddEmail}
                  />
                )}

              </Pane>
            </FormInput>
            {error && (
              <Alert marginBottom={16} intent='danger' title='Erreur'>
                {error}
              </Alert>
            )}

            {isRenewTokenWarningShown && (
              <RenewTokenDialog
                token={token}
                emails={emails}
                baseLocaleId={initialBaseLocale._id}
                isShown={isRenewTokenWarningShown}
                setIsShown={setIsRenewTokenWarningShown}
                setError={setError}
              />
            )}

            <Button height={40} marginTop={8} type='submit' appearance='primary' disabled={!hasChanges} isLoading={isLoading}>
              {isLoading ? 'En cours…' : 'Enregistrer les changements'}
            </Button>

          </Form>
        ) : (
          <Spinner size={64} margin='auto' />
        )}

        <Pane borderBottom='1px solid #d8dae5' width='80%' marginY={16} marginX='auto' />

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
  initialBaseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  codeCommune: PropTypes.string
}

export default Settings
