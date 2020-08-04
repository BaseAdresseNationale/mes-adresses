import React, {useState, useMemo, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, SelectField, TextInput, Button, Alert} from 'evergreen-ui'
import {sortBy} from 'lodash'

import {normalizeSort} from '../../lib/normalize'

import MarkerContext from '../../contexts/marker'
import BalDataContext from '../../contexts/bal-data'

import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import Comment from '../comment'

import PositionEditor from './position-editor'

function NumeroEditor({initialValue, onSubmit, onCancel}) {
  const position = initialValue ? initialValue.positions[0] : null

  const [isLoading, setIsLoading] = useState(false)
  const [numero, onNumeroChange] = useInput(initialValue ? initialValue.numero : '')
  const [voie, setVoie] = useState(initialValue ? initialValue.voie : null)
  const [suffixe, onSuffixeChange] = useInput(initialValue ? initialValue.suffixe : '')
  const [type, onTypeChange] = useInput(position ? position.type : 'entrée')
  const [comment, onCommentChange] = useInput(initialValue ? initialValue.comment : '')
  const [error, setError] = useState()
  const focusRef = useFocus()

  const {
    marker,
    enableMarker,
    disableMarker
  } = useContext(MarkerContext)

  const {voies} = useContext(BalDataContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const body = {
      numero: Number(numero)
    }

    if (initialValue && voie !== initialValue.voie) {
      body.voie = voie
    }

    body.suffixe = suffixe.length > 0 ? suffixe.toLowerCase().trim() : null
    body.comment = comment.length > 0 ? comment : null

    if (marker) {
      body.positions = [
        {
          point: {
            type: 'Point',
            coordinates: [marker.longitude, marker.latitude]
          },
          type
        }
      ]
    }

    try {
      await onSubmit(body)
      disableMarker()
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [initialValue, numero, voie, suffixe, comment, marker, type, onSubmit, disableMarker])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    disableMarker()
    onCancel()
  }, [disableMarker, onCancel])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return initialValue ? 'Modifier' : 'Ajouter'
  }, [initialValue, isLoading])

  useKeyEvent('keyup', ({key}) => {
    if (key === 'Escape') {
      disableMarker()
      onCancel()
    }
  }, [onCancel])

  const hasPositionEditor = useMemo(() => {
    return initialValue ? initialValue.positions.length < 2 : true
  }, [initialValue])

  useEffect(() => {
    if (hasPositionEditor) {
      enableMarker(position)
    } else {
      disableMarker()
    }
  }, [initialValue, hasPositionEditor, enableMarker, position, disableMarker])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      {initialValue && (
        <Pane display='flex'>
          <SelectField
            label='Voie'
            flex={1}
            marginBottom={16}
            onChange={event => setVoie(event.target.value)}
          >
            {sortBy(voies, v => normalizeSort(v.nom)).map(({_id, nom}) => (
              <option
                key={_id}
                selected={_id === initialValue.voie}
                value={_id}
              >
                {nom}
              </option>
            ))}
          </SelectField>
        </Pane>)}

      <Pane display='flex'>
        <TextInput
          required
          display='block'
          type='number'
          disabled={isLoading}
          innerRef={focusRef}
          width='100%'
          maxWidth={300}
          min={0}
          max={9999}
          value={numero}
          marginBottom={16}
          placeholder='Numéro'
          onChange={onNumeroChange}
        />

        <TextInput
          style={{textTransform: 'lowercase'}}
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
      </Pane>

      {marker && (
        <PositionEditor
          initialValue={position}
          alert={
            initialValue ?
              'Déplacez le marqueur sur la carte pour déplacer le numéro.' :
              'Déplacez le marqueur sur la carte pour placer le numéro.'
          }
          marker={marker}
          type={type}
          onTypeChange={onTypeChange}
        />
      )}

      <Comment input={comment} onChange={onCommentChange} />

      {error && (
        <Alert marginBottom={16} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}

      <Button isLoading={isLoading} type='submit' appearance='primary' intent='success' marginTop={16}>
        {submitLabel}
      </Button>

      {onCancel && (
        <Button
          disabled={isLoading}
          appearance='minimal'
          marginLeft={8}
          marginTop={16}
          display='inline-flex'
          onClick={onFormCancel}
        >
          Annuler
        </Button>
      )}
    </Pane>
  )
}

NumeroEditor.propTypes = {
  initialValue: PropTypes.shape({
    numero: PropTypes.number.isRequired,
    voie: PropTypes.string.isRequired,
    suffixe: PropTypes.string,
    comment: PropTypes.string,
    positions: PropTypes.array
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

NumeroEditor.defaultProps = {
  initialValue: null,
  onCancel: null
}

export default NumeroEditor
