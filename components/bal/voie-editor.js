import React, {useState, useMemo, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInput, Button, Checkbox, IconButton, Alert} from 'evergreen-ui'

import MarkerContext from '../../contexts/marker'

import {useInput, useCheckboxInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import PositionEditor from './position-editor'

function VoieEditor({initialValue, onSubmit, onCancel}) {
  const position = initialValue ? initialValue.positions[0] : null

  const [isLoading, setIsLoading] = useState(false)
  const [isToponyme, onIsToponymeChange] = useCheckboxInput(Boolean(position))
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const [positionType, onPositionTypeChange] = useInput(position ? position.type : 'entrée')
  const [error, setError] = useState()
  const setRef = useFocus()

  const {
    marker,
    enableMarker,
    disableMarker
  } = useContext(MarkerContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const body = {
      nom
    }

    if (marker) {
      body.positions = [
        {
          point: {
            type: 'Point',
            coordinates: [marker.longitude, marker.latitude]
          },
          type: positionType
        }
      ]
    }

    try {
      await onSubmit(body)
      disableMarker()
    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
  }, [nom, marker, positionType, onSubmit])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    onCancel()
    disableMarker()
  }, [onCancel])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return initialValue ? 'Modifier' : 'Ajouter'
  }, [initialValue, isLoading])

  useKeyEvent('keyup', ({key}) => {
    if (key === 'Escape') {
      onCancel()
      disableMarker()
    }
  }, [onCancel])

  useEffect(() => {
    if (isToponyme) {
      enableMarker(position)
    } else {
      disableMarker()
    }
  }, [position, disableMarker, enableMarker, isToponyme])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <TextInput
        required
        display='block'
        disabled={isLoading}
        innerRef={setRef}
        width='100%'
        maxWidth={500}
        value={nom}
        maxLength={200}
        marginBottom={16}
        placeholder={isToponyme ? 'Nom du toponyme…' : 'Nom de la voie…'}
        onChange={onNomChange}
      />

      {!initialValue && (
        <Checkbox
          checked={isToponyme}
          label='Cette voie est un toponyme'
          onChange={onIsToponymeChange}
        />
      )}

      {isToponyme && marker && (
        <PositionEditor
          initialValue={position}
          alert={
            initialValue ?
              'Déplacez le marqueur sur la carte pour déplacer le toponyme.' :
              'Déplacez le marqueur sur la carte pour placer le toponyme.'
          }
          marker={marker}
          type={positionType}
          onTypeChange={onPositionTypeChange}
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

VoieEditor.propTypes = {
  initialValue: PropTypes.shape({
    nom: PropTypes.string,
    positions: PropTypes.array.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

export default VoieEditor
