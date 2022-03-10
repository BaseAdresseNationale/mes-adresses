import {useState, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, TextInputField, Checkbox, Button, PlusIcon} from 'evergreen-ui'

import LocalStorageContext from '../../contexts/local-storage'

import {createBaseLocale, addCommune, populateCommune, searchBAL} from '../../lib/bal-api'

import useFocus from '../../hooks/focus'
import {useInput, useCheckboxInput} from '../../hooks/input'

import Form from '../form'
import FormInput from '../form-input'
import {CommuneSearchField} from '../commune-search'
import AlertPublishedBAL from './alert-published-bal'

function CreateForm({defaultCommune}) {
  const {addBalAccess} = useContext(LocalStorageContext)

  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput(
    defaultCommune ? `Adresses de ${defaultCommune.nom}` : ''
  )
  const [email, onEmailChange] = useInput('')
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [commune, setCommune] = useState(defaultCommune ? defaultCommune.code : null)
  const [isShown, setIsShown] = useState(false)
  const [userBALs, setUserBALs] = useState([])
  const [focusRef] = useFocus()

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
      addBalAccess(bal._id, bal.token)
      await addCommune(bal._id, commune, bal.token)

      if (populate) {
        await populateCommune(bal._id, commune, bal.token)
      }

      Router.push(
        `/bal/commune?balId=${bal._id}&codeCommune=${commune}`,
        `/bal/${bal._id}/communes/${commune}`
      )
    }
  }, [email, nom, populate, commune, addBalAccess])

  const onSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    checkUserBALs(commune, email)
  }

  const onCancel = () => {
    setIsShown(false)
    setIsLoading(false)
  }

  const checkUserBALs = async () => {
    const userBALs = await searchBAL(commune, email)

    if (userBALs.length > 0) {
      setUserBALs(userBALs)
      setIsShown(true)
    } else {
      createNewBal()
    }
  }

  return (

    <Pane overflowY='scroll' marginY={32}>
      <Form onFormSubmit={onSubmit}>
        {userBALs.length > 0 && (
          <AlertPublishedBAL
            isShown={isShown}
            userEmail={email}
            basesLocales={userBALs}
            updateBAL={() => checkUserBALs(commune, email)}
            onConfirm={createNewBal}
            onClose={() => onCancel()}
          />
        )}

        <FormInput>
          <TextInputField
            ref={focusRef}
            required
            autoComplete='new-password' // Hack to bypass chrome autocomplete
            name='nom'
            id='nom'
            value={nom}
            maxWidth={600}
            marginBottom={0}
            disabled={isLoading}
            label='Nom de la Base Adresse Locale'
            placeholder='Nom'
            onChange={onNomChange}
          />
        </FormInput>

        <FormInput>
          <TextInputField
            required
            type='email'
            name='email'
            id='email'
            value={email}
            maxWidth={400}
            marginBottom={0}
            disabled={isLoading}
            label='Votre adresse email'
            placeholder='nom@example.com'
            onChange={onEmailChange}
          />
        </FormInput>

        <FormInput>
          <CommuneSearchField
            required
            id='commune'
            initialSelectedItem={defaultCommune}
            label='Commune'
            appearance='default'
            maxWidth={500}
            disabled={isLoading}
            onSelect={onSelect}
          />

          <Checkbox
            label='Importer les voies et numéros depuis la BAN'
            checked={populate}
            disabled={isLoading}
            marginBottom={0}
            onChange={onPopulateChange}
          />
        </FormInput>

        <Button height={40} marginTop={8} type='submit' appearance='primary' intent='success' isLoading={isLoading} iconAfter={isLoading ? null : PlusIcon}>
          {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale'}
        </Button>
      </Form>
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