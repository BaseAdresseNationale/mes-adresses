import React, {useState, useMemo, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, TextInput, Button, IconButton, Alert, Checkbox} from 'evergreen-ui'

import MarkerContext from '../../contexts/marker'
import BalDataContext from '../../contexts/bal-data'

import {useInput, useCheckboxInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import PositionEditor from './position-editor'
import VoieSearch from './voie-search'

function CreateAddress({onSubmit, onCancel}) {
  const {voie} = useContext(BalDataContext)

  const [isLoading, setIsLoading] = useState(false)
  const [isToponyme, onIsToponymeChange] = useCheckboxInput(false)
  const [numero, onNumeroChange] = useInput('')
  const [selectedVoie, setSelectedVoie] = useState(voie)
  const [suffixe, onSuffixeChange] = useInput('')
  const [type, onTypeChange] = useInput('entrée')
  const [error, setError] = useState()
  const focusRef = useFocus()

  const {marker, disableMarker} = useContext(MarkerContext)

  const onSelectVoie = useCallback(selectedVoie => {
    setSelectedVoie(selectedVoie)
  }, [])

  const onFormSubmit = useCallback(async e => {
    const body = {}
    e.preventDefault()

    setIsLoading(true)

    if (isToponyme) {
      body.nom = numero
    } else {
      body.numero = Number(numero)
      body.suffixe = suffixe.length > 0 ? suffixe : null
    }

    body.positions = [
      {
        point: {
          type: 'Point',
          coordinates: [marker.longitude, marker.latitude]
        },
        type
      }
    ]

    try {
      await onSubmit(body, selectedVoie ? selectedVoie._id : null)
      disableMarker()
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [isToponyme, marker, type, numero, suffixe, onSubmit, selectedVoie, disableMarker])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    disableMarker()
    onCancel()
  }, [disableMarker, onCancel])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return 'Ajouter'
  }, [isLoading])

  useEffect(() => {
    setSelectedVoie(isToponyme ? null : voie)
  }, [isToponyme])

  useKeyEvent('keyup', ({key}) => {
    if (key === 'Escape') {
      disableMarker()
      onCancel()
    }
  }, [onCancel])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <Heading is='h4'>Nouvelle adresse</Heading>

      <Pane display='flex'>
        <TextInput
          required
          display='block'
          type={isToponyme ? 'text' : 'number'}
          disabled={isLoading}
          innerRef={focusRef}
          width='100%'
          maxWidth={300}
          min={0}
          max={9999}
          value={numero}
          marginBottom={16}
          placeholder={isToponyme ? 'Nom du toponyme…' : 'Numéro'}
          onChange={onNumeroChange}
        />

        {!isToponyme && (
          <TextInput
            display='block'
            marginLeft={8}
            disabled={isLoading}
            width='100%'
            flex={1}
            minWidth={59}
            value={suffixe}
            maxLength={10}
            marginBottom={16}
            placeholder='Suffixe'
            onChange={onSuffixeChange}
          />
        )}
      </Pane>

      {!isToponyme && (
        <VoieSearch
          defaultVoie={selectedVoie}
          onSelect={onSelectVoie}
        />
      )}

      <Checkbox
        checked={isToponyme}
        label='Cette adresse est un toponyme'
        onChange={onIsToponymeChange}
      />

      {marker && (
        <PositionEditor
          marker={marker}
          type={type}
          onTypeChange={onTypeChange}
        />
      )}

      {error && (
        <Alert marginBottom={16} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}

      <Button isLoading={isLoading} type='submit' appearance='primary' intent='success'>
        {submitLabel}
      </Button>

      {onCancel && (
        <IconButton
          disabled={isLoading}
          icon='undo'
          appearance='minimal'
          marginLeft={8}
          display='inline-flex'
          onClick={onFormCancel}
        />
      )}
    </Pane>
  )
}

CreateAddress.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default CreateAddress
