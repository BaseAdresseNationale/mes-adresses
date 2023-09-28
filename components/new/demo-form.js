import {useState, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Checkbox, Button, Alert, PlusIcon} from 'evergreen-ui'

import {createBaseLocaleDemo} from '@/lib/bal-api'

import LocalStorageContext from '@/contexts/local-storage'

import {useCheckboxInput} from '@/hooks/input'
import useError from '@/hooks/error'

import FormContainer from '@/components/form-container'
import FormInput from '@/components/form-input'
import CommuneSearchField from '@/components/commune-search/commune-search-field'

function DemoForm({defaultCommune}) {
  const {addBalAccess} = useContext(LocalStorageContext)

  const [isLoading, setIsLoading] = useState(false)
  const [setError] = useError()

  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [codeCommune, setCodeCommune] = useState(defaultCommune ? defaultCommune.code : null)
  const [ref, setRef] = useState()

  useEffect(() => {
    if (ref) {
      ref.focus()
    }
  }, [ref])

  const onSelect = useCallback(commune => {
    setCodeCommune(commune.code)
  }, [])

  const onSubmit = async e => {
    e.preventDefault()

    setIsLoading(true)

    try {
      const bal = await createBaseLocaleDemo({commune: codeCommune, populate})

      addBalAccess(bal._id, bal.token)

      Router.push(
        `/bal/${bal._id}`
      )
    } catch (error) {
      setError(error)
      setIsLoading(false)
    }
  }

  return (
    <Pane overflowY='scroll'>
      <FormContainer onSubmit={onSubmit}>
        <FormInput>
          <CommuneSearchField
            required
            innerRef={setRef}
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

        <Alert
          intent='warning'
          title='Attention vous vous apprêtez à créer une Base Adresse Locale de démonstration.'
          marginY='1em'
        >
          Les adresses et voies créées depuis cette démonstration ne pourront pas être publiées dans la Base Adresse Nationale
        </Alert>

        <Button height={40} marginTop={32} marginLeft={12} type='submit' appearance='primary' intent='success' isLoading={isLoading} iconAfter={isLoading ? null : PlusIcon}>
          {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale de démonstration'}
        </Button>
      </FormContainer>
    </Pane>

  )
}

DemoForm.propTypes = {
  defaultCommune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }),
}

DemoForm.defaultProps = {
  defaultCommune: null
}

export default DemoForm
