import {useState, useEffect, useCallback, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {SelectField, SelectMenu, Pane, Button, Text} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'
import {getNumeros} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'

import Form from '@/components/form'
import FormInput from '@/components/form-input'

function AddNumeros({onSubmit, onCancel, isLoading}) {
  const [selectedVoieId, setSelectedVoieId] = useState()
  const [voieNumeros, setVoieNumeros] = useState([])
  const [selectedVoieNumeros, setSelectedVoieNumeros] = useState([])

  const {voies} = useContext(BalDataContext)

  const handleSelectVoie = async idVoie => {
    setSelectedVoieId(idVoie)
    if (idVoie) {
      const numeros = await getNumeros(idVoie)
      setVoieNumeros(numeros)
      setSelectedVoieNumeros(numeros.map(({_id}) => _id))
    }
  }

  const handleSelectNumero = ({value}) => {
    if (value === 'toggle') {
      if (selectedVoieNumeros.length === voieNumeros.length) {
        setSelectedVoieNumeros([])
      } else {
        setSelectedVoieNumeros(voieNumeros.map(({_id}) => _id))
      }
    } else {
      setSelectedVoieNumeros(selectedNumeros => {
        return selectedNumeros.includes(value) ?
          selectedNumeros.filter(id => id !== value) :
          [...selectedNumeros, value]
      })
    }
  }

  const handleSubmit = useCallback(event => {
    event.preventDefault()

    const numeros = selectedVoieNumeros.length > 0 ?
      selectedVoieNumeros :
      voieNumeros.map(({_id}) => _id)

    onSubmit(numeros)
  }, [selectedVoieNumeros, voieNumeros, onSubmit])

  const selectedVoiesCount = useMemo(() => {
    if (selectedVoieNumeros.length === voieNumeros.length) {
      return 'Tous les numéros sont sélectionnés'
    }

    if (selectedVoieNumeros.length === 0) {
      return 'Aucun numéro n’est sélectionné'
    }

    if (selectedVoieNumeros.length === 1) {
      return '1 numéro est sélectionné'
    }

    return `${selectedVoieNumeros.length} numéros sont sélectionnés`
  }, [selectedVoieNumeros.length, voieNumeros.length])

  const numeroOptions = useMemo(() => {
    let options = []

    if (voieNumeros.length > 0) {
      const toggleFullSelect = {label: selectedVoieNumeros.length > 0 ? 'Désélectionner tous les numéros' : 'Sélectionner tous les numéros', value: 'toggle'}
      const numeros = voieNumeros.map(({_id, numero, suffixe}) => ({label: `${numero}${suffixe ? suffixe : ''}`, value: _id}))

      options = [toggleFullSelect, ...numeros]
    }

    return options
  }, [selectedVoieNumeros, voieNumeros])

  useEffect(() => {
    return () => {
      onCancel()
    }
  }, [onCancel])

  return (
    <Pane>
      <Form onFormSubmit={handleSubmit}>
        <Pane display='flex'>
          <FormInput>
            <SelectField
              value={selectedVoieId}
              label='Voie'
              marginBottom={0}
              flex={1}
              onChange={e => handleSelectVoie(e.target.value)}
            >
              {!selectedVoieId && <option>- Sélectionnez une voie -</option>}
              {sortBy(voies, v => normalizeSort(v.nom)).map(({_id, nom}) => (
                <option key={_id} value={_id}>
                  {nom}
                </option>
              ))}
            </SelectField>
          </FormInput>
        </Pane>

        {selectedVoieId && (
          <Pane display='flex' justifyContent='space-between' alignItems='center' marginY={8}>
            <SelectMenu
              isMultiSelect
              hasFilter={false}
              title='Sélection des numéros'
              options={numeroOptions}
              selected={selectedVoieNumeros}
              emptyView={(
                <Pane height='100%' paddingX='1em' display='flex' alignItems='center' justifyContent='center' textAlign='center'>
                  <Text size={300}>Aucun numéro n’est disponible pour cette voie</Text>
                </Pane>
              )}
              onSelect={handleSelectNumero}
              onDeselect={handleSelectNumero}
            >
              <Button marginTop={0} type='button'>
                Sélectionner les numéros
              </Button>
            </SelectMenu>

            {voieNumeros.length > 0 && <Text size={300} fontStyle='italic' color='#2E56CD'>{selectedVoiesCount}</Text>}
          </Pane>
        )}

        <Button
          isLoading={isLoading}
          type='submit'
          appearance='primary'
          intent='success'
          disabled={!(selectedVoieId && voieNumeros.length > 0) || selectedVoieNumeros.length === 0}
        >
          {isLoading ? 'Enregistrement…' : 'Enregistrer'}
        </Button>

        <Button
          disabled={isLoading}
          appearance='minimal'
          marginLeft={8}
          display='inline-flex'
          onClick={onCancel}
        >
          Annuler
        </Button>
      </Form>
    </Pane>
  )
}

AddNumeros.defaultProps = {
  isLoading: false
}

AddNumeros.propTypes = {
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default AddNumeros
