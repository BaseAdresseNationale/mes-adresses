import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, TextInputField, Checkbox, Button} from 'evergreen-ui'

import {storeBalAccess} from '../../lib/tokens'
import {createBaseLocale, addCommune, populateCommune} from '../../lib/bal-api'

import {useInput, useCheckboxInput} from '../../hooks/input'

import {CommuneSearchField} from '../../components/commune-search'

function CreateForm({defaultCommune}) {
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput(
    defaultCommune ? `Adresses de ${defaultCommune.nom}` : ''
  )
  const [email, onEmailChange] = useInput('')
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [commune, setCommune] = useState(defaultCommune ? defaultCommune.code : null)

  const onSelect = useCallback(commune => {
    setCommune(commune.code)
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

    Router.push(
      `/bal/commune?balId=${bal._id}&codeCommune=${commune}`,
      `/bal/${bal._id}/communes/${commune}`
    )
  }, [commune, nom, email, populate])

  return (
    <Pane is='form' margin={16} padding={16} overflowY='scroll' background='tint2' onSubmit={onSubmit}>
      <TextInputField
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
        label='Importer les voies et numéros depuis la BAN'
        checked={populate}
        disabled={isLoading}
        onChange={onPopulateChange}
      />

      <Button height={40} marginTop={8} type='submit' appearance='primary' isLoading={isLoading}>
        {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale'}
      </Button>
    </Pane>
  )
}

CreateForm.propTypes = {
  defaultCommune: PropTypes.object
}

CreateForm.defaultProps = {
  defaultCommune: null
}

export default CreateForm
