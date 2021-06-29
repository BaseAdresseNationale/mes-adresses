import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, TextInputField, Checkbox, Button, PlusIcon} from 'evergreen-ui'

import {storeBalAccess} from '../../lib/tokens'
import {createBaseLocale, addCommune, populateCommune, foundBALbyCommuneAndEmail} from '../../lib/bal-api'

import useFocus from '../../hooks/focus'
import {useInput, useCheckboxInput} from '../../hooks/input'

import {CommuneSearchField} from '../../components/commune-search'
import AlertPublishedBAL from './alert-published-bal'

function CreateForm({defaultCommune}) {
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput(
    defaultCommune ? `Adresses de ${defaultCommune.nom}` : ''
  )
  const [email, onEmailChange] = useInput('')
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [commune, setCommune] = useState(defaultCommune ? defaultCommune.code : null)
  const [isShown, setIsShown] = useState(false)
  const [userBALs, setUserBALs] = useState([])
  const focusRef = useFocus()

  const onSelect = useCallback(commune => {
    setCommune(commune.code)
  }, [])

  const createNewBal = useCallback(async () => {
    const bal = await createBaseLocale({
      nom,
      emails: [
        email
      ]
    })

    if (commune) {
      storeBalAccess(bal._id, bal.token)
      await addCommune(bal._id, commune, bal.token)

      if (populate) {
        await populateCommune(bal._id, commune, bal.token)
      }

      Router.push(
        `/bal/commune?balId=${bal._id}&codeCommune=${commune}`,
        `/bal/${bal._id}/communes/${commune}`
      )
    }
  }, [email, nom, populate, commune])

  const onSubmit = useCallback(async e => {
    e.preventDefault()
    setIsLoading(true)

    const foundUserBALs = await foundBALbyCommuneAndEmail(commune, email)

    if (foundUserBALs.length > 0) {
      setUserBALs(foundUserBALs)
      setIsShown(true)
    } else {
      createNewBal()
    }
  }, [createNewBal, email, commune])

  const onCancel = () => {
    setIsShown(false)
    setIsLoading(false)
  }

  return (
    <Pane is='form' margin={16} padding={16} overflowY='scroll' background='white' onSubmit={onSubmit}>
      {userBALs.length > 0 && (
        <AlertPublishedBAL
          isShown={isShown}
          basesLocales={userBALs}
          onConfirm={createNewBal}
          onClose={() => onCancel()}
        />
      )}

      <TextInputField
        ref={focusRef}
        required
        autoComplete='new-password' // Hack to bypass chrome autocomplete
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
        initialSelectedItem={defaultCommune}
        label='Commune'
        maxWidth={500}
        disabled={isLoading}
        onSelect={onSelect}
      />

      <Checkbox
        label='Importer les voies et numéros depuis la BAN'
        checked={populate}
        disabled={isLoading}
        onChange={onPopulateChange}
      />

      <Button height={40} marginTop={8} type='submit' appearance='primary' intent='success' isLoading={isLoading} iconAfter={isLoading ? null : PlusIcon}>
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
