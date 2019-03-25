import React, {useState, useCallback} from 'react'
import Router from 'next/router'
import {Pane, Alert, Heading, Paragraph, Button, TextInputField} from 'evergreen-ui'

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

function Index() {
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

  const onCreateNew = useCallback(() => {
    Router.push('/new')
  }, [])

  const onDrop = useCallback(([file]) => {
    if (getFileExtension(file.name) !== 'csv') {
      return onError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier CSV.')
    }

    if (file.size > 100 * 1024 * 1024) {
      return onError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 100 Mo.')
    }

    setFile(file)
    setError(null)
  }, [])

  const onSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const baseLocale = await createBaseLocale({
      nom,
      emails: [
        email
      ]
    })

    storeBalAccess(baseLocale._id, baseLocale.token)

    try {
      await uploadBaseLocaleCsv(baseLocale._id, file, baseLocale.token)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }

    Router.push(`/bal?balId=${baseLocale._id}`, `/bal/${baseLocale._id}`)
  }, [nom, email, file])

  return (
    <>
      <Pane paddingX={16} paddingBottom={10} marginBottom={10}>
        <Heading size={600} margin='default'>Nouvelle Base Adresse Locale</Heading>
        <Paragraph>
          Pour être éditable à l’aide de cet outil, votre fichier doit être conforme au modèle BAL 1.1 de l’AITF.
        </Paragraph>
      </Pane>

      <Pane borderTop is='form' padding={16} flex={1} overflowY='scroll' onSubmit={onSubmit}>
        <Uploader
          file={file}
          height={150}
          marginBottom={24}
          placeholder='Sélectionnez ou glissez ici votre fichier BAL au format CSV (maximum 100 Mo)'
          loadingLabel='Analyse en cours'
          disabled={isLoading}
          onDrop={onDrop}
        />

        {file && (
          <>
            <TextInputField
              required
              innerRef={focusRef}
              name='nom'
              id='nom'
              value={nom}
              maxWidth={600}
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
              maxWidth={400}
              disabled={isLoading}
              label='Votre adresse email'
              placeholder='nom@example.com'
              onChange={onEmailChange}
            />
          </>
        )}

        {error && (
          <Alert marginBottom={16} intent='danger' title='Erreur'>
            {error}
          </Alert>
        )}

        {file && (
          <Button height={40} type='submit' appearance='primary' isLoading={isLoading}>
            {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale'}
          </Button>
        )}
      </Pane>

      <Pane borderTop marginTop='auto' padding={16}>
        <Paragraph size={300} color='muted'>
          Vous pouvez créer une nouvelle Base Adresse Locale à partir de la commune de votre choix.
        </Paragraph>
        <Button marginTop={10} onClick={onCreateNew}>
          Créer une nouvelle Base Adresse Locale
        </Button>
      </Pane>
    </>
  )
}

Index.getInitialProps = () => ({
  layout: 'fullscreen'
})

export default Index
