import React, {useCallback, useState} from 'react'
import {Pane, Heading, Paragraph, TextInputField, Checkbox, Button} from 'evergreen-ui'

import {createBaseLocale, addCommune, populateCommune} from '../../lib/bal-api'
import {getCommune} from '../../lib/geo-api'
import {storeBalAccess} from '../../lib/tokens'

import {useInput, useCheckboxInput} from '../../hooks/input'

import {CommuneSearchField} from '../../components/commune-search'

function Index({defaultCommune}) {
  const [nom, onNomChange] = useInput('')
  const [email, onEmailChange] = useInput('')
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [commune, setCommune] = useState(defaultCommune ? defaultCommune.code : null)

  const onSelect = useCallback(commune => {
    setCommune(commune.code)
  }, [])

  const onSubmit = async e => {
    e.preventDefault()

    const bal = await createBaseLocale({
      nom,
      emails: [
        email
      ]
    })

    storeBalAccess(bal._id, bal.token)

    await addCommune(bal._id, commune, bal.token)

    if (populate) {
      try {
        await populateCommune(bal._id, commune, bal.token)
      } catch (error) {
        console.log('Not implemented yet')
      }
    }
  }

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
          label='Votre adresse email'
          placeholder='nom@example.com'
          onChange={onEmailChange}
        />

        <CommuneSearchField
          required
          id='commune'
          defaultSelectedItem={defaultCommune}
          label='Commune initiale'
          maxWidth={500}
          hint='Vous pourrez ajouter plusieurs communes à la Base Adresse Locale plus tard.'
          onSelect={onSelect}
        />

        <Checkbox
          label='Importer les noms des voies'
          checked={populate}
          onChange={onPopulateChange}
        />

        <Button height={40} marginTop={8} type='submit' appearance='primary'>
          Créer la Base Adresse Locale
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
