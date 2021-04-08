import React, {useState, useCallback, useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {SelectField, SelectMenu, Pane, Button, Alert, Text} from 'evergreen-ui'

import {normalizeSort} from '../../lib/normalize'
import {getNumeros} from '../../lib/bal-api'

import BalDataContext from '../../contexts/bal-data'

function AddNumeros({onSubmit, onCancel, isLoading}) {
  const [selectedVoie, setSelectedVoie] = useState(null)
  const [voieNumeros, setVoieNumeros] = useState([])
  const [selectedVoieNumeros, setSelectedVoieNumeros] = useState([])

  const {voies} = useContext(BalDataContext)

  const handleSelectVoie = async idVoie => {
    setSelectedVoie(idVoie)
    if (idVoie) {
      const numeros = await getNumeros(idVoie)
      setVoieNumeros(numeros)
    }
  }

  const handleSelectNumero = ({value}) => {
    setSelectedVoieNumeros(selectedNumeros => {
      return selectedNumeros.includes(value) ?
        selectedNumeros.filter(id => id !== value) :
        [...selectedNumeros, value]
    })
  }

  const numerosLabel = useMemo(() => {
    const selectedNumeroCount = selectedVoieNumeros.length
    if (selectedNumeroCount === 0) {
      return 'Choisir les numéros'
    }

    if (selectedNumeroCount === 1) {
      const numero = voieNumeros.find(({_id}) => _id === selectedVoieNumeros[0])
      const voie = voies.find(({_id}) => _id === selectedVoie)
      return `le ${numero.numero} ${voie.nom}`
    }

    return `${selectedNumeroCount} numéros sélectionnés`
  }, [selectedVoie, voieNumeros, selectedVoieNumeros, voies])

  const handleSubmit = useCallback(() => {
    const numeros = selectedVoieNumeros.length > 0 ?
      selectedVoieNumeros :
      voieNumeros.map(({_id}) => _id)
    onSubmit(numeros)
  }, [selectedVoieNumeros, voieNumeros, onSubmit])

  return (
    <Pane>
      <Pane display='flex'>
        <SelectField
          label='Voie'
          flex={1}
          marginBottom={16}
          onChange={e => handleSelectVoie(e.target.value)}
        >
          <option value={null}>- Sélectionnez une voie -</option>
          {sortBy(voies, v => normalizeSort(v.nom)).map(({_id, nom}) => (
            <option key={_id} value={_id} selected={_id === selectedVoie}>
              {nom}
            </option>
          ))}
        </SelectField>
      </Pane>

      {selectedVoie && (
        <>

          <Alert marginY={8} title='Préciser les numéros à ajouter au toponyme'>
            <Text>
              Sélectionnez les numéros que vous souhaitez ajouter au toponyme. Si aucun numéro n’est spécifié, alors tous les numéros de la voie seront ajoutés.
            </Text>

            <Pane diplay='flex'>
              <SelectMenu
                isMultiSelect
                hasFilter={false}
                title='Sélection des numéros'
                options={voieNumeros.map(({_id, numero}) => ({label: `${numero}`, value: _id}))}
                selected={selectedVoieNumeros}
                emptyView={(
                  <Pane height='100%' paddingX='1em' display='flex' alignItems='center' justifyContent='center' textAlign='center'>
                    <Text size={300}>Aucun numéro n’est disponible pour cette voie</Text>
                  </Pane>
                )}
                onSelect={handleSelectNumero}
                onDeselect={handleSelectNumero}
              >
                <Button marginTop={8} type='div'>
                  {numerosLabel}
                </Button>
              </SelectMenu>
            </Pane>
          </Alert>
        </>
      )}

      <Button
        isLoading={isLoading}
        type='submit'
        appearance='primary'
        intent='success'
        disabled={!(selectedVoie && voieNumeros.length > 0)}
        marginTop={16}
        onClick={handleSubmit}
      >
        {isLoading ? 'Enregistrement…' : 'Enregistrer'}
      </Button>

      <Button
        disabled={isLoading}
        appearance='minimal'
        marginLeft={8}
        marginTop={16}
        display='inline-flex'
        onClick={onCancel}
      >
        Annuler
      </Button>
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
