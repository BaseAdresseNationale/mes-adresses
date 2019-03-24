import React, {useCallback, useState} from 'react'
import Router from 'next/router'
import {Pane, Heading, Paragraph, TextInputField, Checkbox, Button} from 'evergreen-ui'

import {createBaseLocale, addCommune, populateCommune} from '../../lib/bal-api'
import {getCommune} from '../../lib/geo-api'
import {storeBalAccess} from '../../lib/tokens'

import {useInput, useCheckboxInput} from '../../hooks/input'

import {CommuneSearchField} from '../../components/commune-search'

function Index({defaultCommune}) {
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput('')
  const [email, onEmailChange] = useInput('')
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [commune, setCommune] = useState(defaultCommune ? defaultCommune.code : null)

  const onSelect = useCallback(commune => {
    setCommune(commune.code)
  }, [])

  const onCreateUpload = useCallback(() => {
    Router.push('/new/upload')
  }, [])

  const onSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const bal = await createBaseLocale({
      nom,
      emails: [
        email
      ]
    })

    storeBalAccess(bal._id, bal.token)

    await addCommune(bal._id, commune, bal.token)

    if (populate) {
      await populateCommune(bal._id, commune, bal.token)
    }

    Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
  }, [commune, nom, email, populate])

  return (
    <>
      <Pane paddingX={16} paddingBottom={10} marginBottom={10}>
        <Heading size={600} margin='default'>Nouvelle Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale.
        </Paragraph>
      </Pane>

      <Pane borderTop is='form' padding={16} flex={1} overflowY='scroll' onSubmit={onSubmit}>
        <TextInputField
          required
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

        <CommuneSearchField
          required
          id='commune'
          defaultSelectedItem={defaultCommune}
          label='Commune'
          maxWidth={500}
          disabled={isLoading}
          hint='Vous pourrez ajouter plusieurs communes à la Base Adresse Locale plus tard.'
          onSelect={onSelect}
        />

        <Checkbox
          label='Importer les noms des voies'
          checked={populate}
          disabled={isLoading}
          onChange={onPopulateChange}
        />

        <Button height={40} marginTop={8} type='submit' appearance='primary' isLoading={isLoading}>
          {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale'}
        </Button>
      </Pane>

      <Pane borderTop marginTop='auto' padding={16}>
        <Paragraph size={300} color='muted'>
          Vous pouvez créer une nouvelle Base Adresse Locale à partir d’un fichier CSV conforme au modèle BAL 1.1 de l’AITF.
        </Paragraph>
        <Button marginTop={10} onClick={onCreateUpload}>
          Créer une nouvelle Base Adresse Locale
        </Button>
      </Pane>
    </>
  )
}

Index.getInitialProps = async ({query}) => {
  let defaultCommune
  if (query.commune) {
    defaultCommune = await getCommune(query.commune, {
      fields: 'departement'
    })
  }

  return {
    defaultCommune,
    layout: 'fullscreen'
  }
}

export default Index
