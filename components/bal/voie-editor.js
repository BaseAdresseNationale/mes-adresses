import React, {useState, useMemo, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, TextInput, Button, Checkbox, IconButton} from 'evergreen-ui'

import MarkerContext from '../../contexts/marker'

import {useInput, useCheckboxInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import PositionEditor from './position-editor'

function VoieEditor({initialValue, onSubmit, onCancel}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isToponyme, onIsToponymeChange] = useCheckboxInput(initialValue && initialValue.positions[0])
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
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
          type: 'entrée'
        }
      ]
    }

    try {
      await onSubmit(body)
    } catch (error) {
      setIsLoading(false)
    }

    disableMarker()
  }, [nom, marker, onSubmit])

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
    }
  }, [onCancel])

  useEffect(() => {
    if (isToponyme) {
      enableMarker(initialValue ? initialValue.positions[0] : null)
    } else {
      disableMarker()
    }
  }, [disableMarker, enableMarker, isToponyme])

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
          label='Ajouter un toponyme'
          onChange={onIsToponymeChange}
        />
      )}

      {isToponyme && marker && (
        <PositionEditor
          alert={
            initialValue ?
              'Déplacez le marqueur sur la carte pour déplacer le toponyme.' :
              'Déplacez le marqueur sur la carte pour placer le toponyme.'
          }
          marker={marker}
        />
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
