import React, {useState, useCallback, useEffect} from 'react'
import Router from 'next/router'
import {Pane, Alert, Button, TextInputField, Text, FormField, PlusIcon, InboxIcon} from 'evergreen-ui'

import {createBaseLocale, uploadBaseLocaleCsv} from '../../lib/bal-api'
import {storeBalAccess} from '../../lib/tokens'

import useFocus from '../../hooks/focus'
import {useInput} from '../../hooks/input'

import Uploader from '../../components/uploader'

function getFileExtension(name) {
  const pos = name.lastIndexOf('.')
  if (pos > 0) {
    return name.substr(pos + 1)
  }

  return null
}

function UploadForm() {
  const [bal, setBal] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput('')
  const [email, onEmailChange] = useInput('')
  const focusRef = useFocus()

  const onError = error => {
    setFile(null)
    setIsLoading(false)
    setError(error)
  }

  const onDrop = useCallback(([file]) => {
    if (getFileExtension(file.name).toLowerCase() !== 'csv') {
      return onError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier CSV.')
    }

    if (file.size > 10 * 1024 * 1024) {
      return onError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 10 Mo.')
    }

    setFile(file)
    setError(null)
  }, [])

  const onSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    if (!bal) {
      const baseLocale = await createBaseLocale({
        nom,
        emails: [
          email
        ]
      })

      storeBalAccess(baseLocale._id, baseLocale.token)
      setBal(baseLocale)
    }
  }, [bal, nom, email])

  useEffect(() => {
    async function upload() {
      try {
        const response = await uploadBaseLocaleCsv(bal._id, file, bal.token)
        if (!response.isValid) {
          throw new Error('Fichier invalide')
        }

        Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
      } catch (error) {
        setError(error.message)
      }
    }

    if (file && bal) {
      setIsLoading(true)
      upload()
    }
  }, [bal, file])

  useEffect(() => {
    if (file || error) {
      setIsLoading(false)
    }
  }, [error, file])

  return (
    <>
      <Pane is='form' margin={16} padding={16} flex={1} overflowY='scroll' backgroundColor='white' onSubmit={onSubmit}>
        <Pane display='flex' flexDirection='row'>
          <Pane flex={1} maxWidth={600}>
            <TextInputField
              ref={focusRef}
              required
              autoComplete='new-password' // Hack to bypass chrome autocomplete
              name='nom'
              id='nom'
              value={nom}
              disabled={isLoading}
              label='Nom de la Base Adresse Locale'
              placeholder='Nom'
              onChange={onNomChange}
            />

            <TextInputField
              required
              type='email'
              name='email'
              id='email'
              value={email}
              disabled={isLoading}
              label='Votre adresse email'
              placeholder='nom@example.com'
              onChange={onEmailChange}
            />
          </Pane>

          <Pane flex={1} marginLeft={16}>
            <FormField label='Fichier CSV' />
            <Uploader
              file={file}
              height={150}
              marginBottom={24}
              placeholder='Sélectionnez ou glissez ici votre fichier BAL au format CSV (maximum 100 Mo)'
              loadingLabel='Analyse en cours'
              disabled={isLoading}
              onDrop={onDrop}
            />
          </Pane>
        </Pane>

        {error && (
          <Alert marginBottom={16} intent='danger' title='Erreur'>
            {error}
          </Alert>
        )}

        <Button height={40} type='submit' appearance='primary' intent='success' disabled={Boolean(error) || !file} isLoading={isLoading} iconAfter={isLoading ? null : PlusIcon}>
          {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale'}
        </Button>
      </Pane>

      <Alert margin={16} title='Vous disposez déjà d’une Base Adresse Locale au format CSV gérée à partir d’un autre outil ?' marginY={16}>
        <Text>
          Utilisez notre formulaire de dépôt afin de publier vos adresses dans la Base Adresse Nationale.
        </Text>
        <Pane marginTop={16}>
          <Button appearance='primary' iconBefore={InboxIcon} is='a' href='https://adresse.data.gouv.fr/bases-locales/publication'>Accéder au formulaire de dépôt d’une Base Adresse Locale sur adresse.data.gouv.fr</Button>
        </Pane>
      </Alert>
    </>
  )
}

UploadForm.getInitialProps = () => ({
  layout: 'fullscreen'
})

export default UploadForm
