import {useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, TextInputField, Checkbox, Button, PlusIcon} from 'evergreen-ui'

import {populateCommune} from '@/lib/bal-api'
import {useCheckboxInput} from '@/hooks/input'

import useFocus from '@/hooks/focus'

import FormContainer from '@/components/form-container'
import FormInput from '@/components/form-input'
import CommuneSearchField from '@/components/commune-search/commune-search-field'
import AlertPublishedBAL from '@/components/new/alert-published-bal'

function CreateForm({
  defaultCommune,
  nom,
  onNomChange,
  selectedCodeCommune,
  setSelectedCodeCommune,
  bal,
  email,
  onEmailChange,
  userBALs,
  onCancel,
  isLoading,
  isShown,
  checkUserBALs,
  createNewBal,
  onSubmit
}) {
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [focusedElement] = useFocus(true)

  const onSelect = useCallback(commune => {
    setSelectedCodeCommune(commune.code)
  }, [setSelectedCodeCommune])

  const redirectToNewBAL = useCallback(async newBal => {
    if (populate) {
      await populateCommune(newBal._id, newBal.token)
    }

    Router.push(
      `/bal?balId=${newBal._id}`,
      `/bal/${newBal._id}`
    )
  }, [populate])

  useEffect(() => {
    if (bal) {
      redirectToNewBAL(bal)
    }
  }, [redirectToNewBAL, bal])

  return (

    <Pane overflowY='scroll' marginY={32}>
      <FormContainer onSubmit={onSubmit}>
        {userBALs.length > 0 && (
          <AlertPublishedBAL
            isShown={isShown}
            userEmail={email}
            basesLocales={userBALs}
            updateBAL={checkUserBALs}
            onConfirm={() => createNewBal(selectedCodeCommune)}
            onClose={onCancel}
          />
        )}

        <FormInput>
          <TextInputField
            ref={focusedElement}
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
            hint='Pour affiner la recherche, renseignez le code département'
            placeholder='Roche 42'
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
      </FormContainer>
    </Pane>

  )
}

CreateForm.propTypes = {
  defaultCommune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }),
  selectedCodeCommune: PropTypes.string,
  setSelectedCodeCommune: PropTypes.func.isRequired,
  nom: PropTypes.string.isRequired,
  onNomChange: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  bal: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired
  }),
  userBALs: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isShown: PropTypes.bool.isRequired,
  checkUserBALs: PropTypes.func.isRequired,
  createNewBal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

CreateForm.defaultProps = {
  defaultCommune: null,
  selectedCodeCommune: null,
  bal: null
}

export default CreateForm
