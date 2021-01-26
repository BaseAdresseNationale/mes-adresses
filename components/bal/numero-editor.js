import React, {useState, useMemo, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, SelectField, TextInput, Button, Alert} from 'evergreen-ui'
import nearestPointOnLine from '@turf/nearest-point-on-line'
import length from '@turf/length'
import lineSlice from '@turf/line-slice'
import {sortBy} from 'lodash'

import {normalizeSort} from '../../lib/normalize'

import MarkersContext from '../../contexts/markers'
import BalDataContext from '../../contexts/bal-data'

import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import Comment from '../comment'

import PositionEditor from './position-editor'

function NumeroEditor({initialVoie, initialValue, onSubmit, onCancel}) {
  const position = initialValue ? initialValue.positions[0] : null

  const {voies} = useContext(BalDataContext)

  const [voie, setVoie] = useState(initialVoie)

  const [isLoading, setIsLoading] = useState(false)
  const [numero, onNumeroChange, resetNumero] = useInput(initialValue ? initialValue.numero : '')
  const [suffixe, onSuffixeChange, resetSuffixe] = useInput(initialValue ? initialValue.suffixe : '')
  const [type, onTypeChange, resetType] = useInput(position ? position.type : 'entrée')
  const [comment, onCommentChange, resetComment] = useInput(initialValue ? initialValue.comment : '')
  const [error, setError] = useState()
  const focusRef = useFocus()

  const {
    markers,
    enableMarkers,
    disableMarkers,
    setOverrideText
  } = useContext(MarkersContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const body = {
      numero: Number(numero),
      voie: voie._id,
      suffixe: suffixe.length > 0 ? suffixe.toLowerCase().trim() : null,
      comment: comment.length > 0 ? comment : null
    }

    if (markers[0]) {
      body.positions = [
        {
          point: {
            type: 'Point',
            coordinates: [markers[0].longitude, markers[0].latitude]
          },
          type
        }
      ]
    }

    try {
      await onSubmit(body)
      disableMarkers()
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [numero, voie, suffixe, comment, markers, type, onSubmit, disableMarkers])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    disableMarkers()
    onCancel()
  }, [disableMarkers, onCancel])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return initialValue ? 'Modifier' : 'Ajouter'
  }, [initialValue, isLoading])

  const handleVoieChange = event => {
    const {value} = event.target
    const voie = voies.find(({_id}) => _id === value)

    setVoie(voie)
  }

  useKeyEvent('keyup', ({key}) => {
    if (key === 'Escape') {
      disableMarkers()
      onCancel()
    }
  }, [onCancel])

  const hasPositionEditor = useMemo(() => {
    return initialValue ? initialValue.positions.length < 2 : true
  }, [initialValue])

  const numeroSuggestion = useMemo(() => {
    if (markers[0] && voie.trace) {
      const {trace} = voie
      const point = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [markers[0].longitude, markers[0].latitude]
        }
      }
      const from = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: trace.coordinates[0]
        }
      }

      const to = nearestPointOnLine({type: 'Feature', geometry: trace}, point, {units: 'kilometers'})
      const slicedLine = length(lineSlice(from, to, trace)) * 1000
      return slicedLine.toFixed(0)
    }
  }, [markers, voie])

  useEffect(() => {
    if (hasPositionEditor) {
      enableMarkers(position)
    } else {
      disableMarkers()
    }
  }, [initialValue, hasPositionEditor, enableMarkers, position, disableMarkers])

  useEffect(() => {
    setOverrideText(numero || numeroSuggestion)
  }, [numeroSuggestion, numero, setOverrideText])

  useEffect(() => {
    const {numero, suffixe, comment} = initialValue || {}
    resetNumero(numero)
    resetSuffixe(suffixe ? suffixe : '')
    resetType(position ? position.type : 'entrée')
    resetComment(comment ? comment : '')
    setError(null)
  }, [position, resetNumero, resetSuffixe, resetType, resetComment, setError, initialValue])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      {initialValue && (
        <Pane display='flex'>
          <SelectField
            label='Voie'
            flex={1}
            marginBottom={16}
            onChange={handleVoieChange}
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
          ref={focusRef}
          required
          display='block'
          type='number'
          disabled={isLoading}
          width='100%'
          maxWidth={300}
          min={0}
          max={9999}
          value={numero}
          marginBottom={16}
          placeholder={`Numéro${numeroSuggestion ? ` recommandé : ${numeroSuggestion}` : ''}`}
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

      {markers.length > 0 && (
        <PositionEditor
          initialValue={position}
          alert={
            initialValue ?
              'Déplacez le marqueur sur la carte pour déplacer le numéro.' :
              'Déplacez le marqueur sur la carte pour placer le numéro.'
          }
          marker={markers[0]}
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
  initialVoie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    trace: PropTypes.object
  }).isRequired,
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
