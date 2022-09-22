import {useState, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, TextInputField, Checkbox, Button, PlusIcon} from 'evergreen-ui'

import {createBaseLocale, populateCommune, searchBAL} from '@/lib/bal-api'

import LocalStorageContext from '@/contexts/local-storage'

import {useCheckboxInput} from '@/hooks/input'

import FormContainer from '@/components/form-container'
import FormInput from '@/components/form-input'
import CommuneSearchField from '@/components/commune-search/commune-search-field'
import AlertPublishedBAL from '@/components/new/alert-published-bal'

function CreateForm({namePlaceholder, commune, nom, onNomChange, email, onEmailChange, handleCommune}) {
  const {addBalAccess} = useContext(LocalStorageContext)

  const [isLoading, setIsLoading] = useState(false)
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [isShown, setIsShown] = useState(false)
  const [userBALs, setUserBALs] = useState([])
  const [ref, setRef] = useState()

  useEffect(() => {
    if (ref) {
      ref.focus()
    }
  }, [ref])

  const createNewBal = useCallback(async () => {
    if (commune) {
      const bal = await createBaseLocale({
        nom,
        emails: [
          email
        ],
        commune: commune.code
      })

      addBalAccess(bal._id, bal.token)

      if (populate) {
        await populateCommune(bal._id, bal.token)
      }

      Router.push(
        `/bal?balId=${bal._id}`,
        `/bal/${bal._id}`
      )
    }
  }, [email, nom, populate, commune, addBalAccess])

  const onSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    checkUserBALs(commune.code, email)
  }

  const onCancel = () => {
    setIsShown(false)
    setIsLoading(false)
  }

  const checkUserBALs = async () => {
    const userBALs = await searchBAL(commune.code, email)

    if (userBALs.length > 0) {
      setUserBALs(userBALs)
      setIsShown(true)
    } else {
      createNewBal()
    }
  }

  return (

    <Pane overflowY='scroll' marginY={32}>
      <FormContainer onSubmit={onSubmit}>
        {userBALs.length > 0 && (
          <AlertPublishedBAL
            isShown={isShown}
            userEmail={email}
            basesLocales={userBALs}
            updateBAL={() => checkUserBALs(commune.code, email)}
            onConfirm={createNewBal}
            onClose={() => onCancel()}
          />
        )}

        <FormInput>
          <CommuneSearchField
            required
            innerRef={setRef}
            id='commune'
            initialSelectedItem={commune}
            label='Commune'
            hint='Pour affiner la recherche, renseignez le code département'
            placeholder='Roche 42'
            appearance='default'
            maxWidth={500}
            disabled={isLoading}
            onSelect={handleCommune}
          />

          <Checkbox
            label='Importer les voies et numéros depuis la BAN'
            checked={populate}
            disabled={isLoading}
            marginBottom={0}
            onChange={onPopulateChange}
          />
        </FormInput>

        <FormInput>
          <TextInputField
            required
            autoComplete='new-password' // Hack to bypass chrome autocomplete
            name='nom'
            id='nom'
            value={nom}
            maxWidth={600}
            marginBottom={0}
            disabled={isLoading}
            label='Nom de la Base Adresse Locale'
            placeholder={namePlaceholder}
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

        <Button height={40} marginTop={8} type='submit' appearance='primary' intent='success' isLoading={isLoading} iconAfter={isLoading ? null : PlusIcon}>
          {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale'}
        </Button>
      </FormContainer>
    </Pane>
  )
}

CreateForm.defaultProps = {
  namePlaceholder: 'Nom',
  commune: null
}

CreateForm.propTypes = {
  namePlaceholder: PropTypes.string,
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }),
  nom: PropTypes.string.isRequired,
  onNomChange: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  handleCommune: PropTypes.func.isRequired
}

export default CreateForm
