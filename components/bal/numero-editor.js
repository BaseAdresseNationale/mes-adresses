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
  const {voies} = useContext(BalDataContext)

  const [voie, setVoie] = useState(initialVoie)

  const [isLoading, setIsLoading] = useState(false)
  const [numero, onNumeroChange, resetNumero] = useInput(initialValue ? initialValue.numero : '')
  const [suffixe, onSuffixeChange, resetSuffixe] = useInput(initialValue ? initialValue.suffixe : '')
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

    if (markers.length > 0) {
      const positions = []
      markers.forEach(marker => {
        positions.push(
          {
            point: {
              type: 'Point',
              coordinates: [marker.longitude, marker.latitude]
            },
            type: marker.type
          }
        )
      })

      body.positions = positions
    }

    try {
      await onSubmit(body)
      disableMarkers()
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }, [numero, voie, suffixe, comment, markers, onSubmit, disableMarkers])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    disableMarkers()
    onCancel()
  }, [disableMarkers, onCancel])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return 'Enregistrer'
  }, [isLoading])

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

  const numeroSuggestion = useMemo(() => {
    if (markers[0] && markers[0].latitude && markers[0].longitude && voie.trace) {
      const marker = markers.find(marker => marker.type === 'entrée') || markers[0]

      const {trace} = voie
      const point = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [marker.longitude, marker.latitude]
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
    if (initialValue) {
      const positions = initialValue.positions.map(position => (
        {
          longitude: position.point.coordinates[0],
          latitude: position.point.coordinates[1],
          type: position.type
        }
      ))

      enableMarkers(positions)
    } else {
      enableMarkers([{type: 'entrée'}])
    }
  }, [initialValue, enableMarkers, disableMarkers])

  useEffect(() => {
    setOverrideText(numero || numeroSuggestion)
  }, [numeroSuggestion, numero, setOverrideText])

  useEffect(() => {
    const {numero, suffixe, comment} = initialValue || {}
    resetNumero(numero)
    resetSuffixe(suffixe ? suffixe : '')
    resetComment(comment ? comment : '')
    setError(null)
  }, [resetNumero, resetSuffixe, resetComment, setError, initialValue])

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
        </Pane>
      )}

      <Pane display='flex'>
        <TextInput
          ref={focusRef}
          required
          display='block'
          type='number'
          disabled={isLoading}
          width='100%'
          maxWidth={300}
          flex={2}
          min={0}
          max={9999}
          value={numero}
          marginBottom={8}
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
          marginBottom={8}
          placeholder='Suffixe'
          onChange={onSuffixeChange}
        />
      </Pane>

      {markers.length > 0 && (
        <PositionEditor
          markers={markers}
          enableMarkers={enableMarkers}
        />
      )}

      {alert && (
        <Alert marginBottom={16}>
          {initialValue && markers.length > 1 ?
            'Déplacer les marqueurs sur la carte pour modifier les positions' :
            initialValue && markers.length === 1 ?
              'Déplacer le marqueur sur la carte pour déplacer le numéro.' :
              'Déplacer le marqueur sur la carte pour placer le numéro.'
          }
        </Alert>
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
