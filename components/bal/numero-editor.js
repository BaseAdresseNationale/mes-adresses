import React, {useState, useMemo, useCallback, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, SelectField, TextInput, Button, Alert} from 'evergreen-ui'
import {sortBy} from 'lodash'

import {normalizeSort} from '../../lib/normalize'

import MarkersContext from '../../contexts/markers'
import BalDataContext from '../../contexts/bal-data'

import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import Comment from '../comment'
import PositionEditor from './position-editor'

const REMOVE_TOPONYME_LABEL = 'Aucun toponyme'

function NumeroEditor({initialVoieId, initialValue, onSubmit, onCancel}) {
  const {voies, toponymes} = useContext(BalDataContext)
  const [voieId, setVoieId] = useState(initialVoieId || initialValue?.voie._id)
  const [toponymeId, setToponymeId] = useState(initialValue?.toponyme)

  const [isLoading, setIsLoading] = useState(false)
  const [numero, onNumeroChange, resetNumero] = useInput(initialValue?.numero || '')
  const [suffixe, onSuffixeChange, resetSuffixe] = useInput(initialValue?.suffixe || '')
  const [comment, onCommentChange, resetComment] = useInput(initialValue?.comment || '')
  const [error, setError] = useState()
  const focusRef = useFocus()

  const {
    markers,
    addMarker,
    disableMarkers,
    suggestedNumero,
    setOverrideText
  } = useContext(MarkersContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const body = {
      voie: voieId,
      toponyme: toponymeId,
      numero: Number(numero),
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
  }, [numero, voieId, toponymeId, suffixe, comment, markers, onSubmit, disableMarkers])

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

  useKeyEvent('keyup', ({key}) => {
    if (key === 'Escape') {
      disableMarkers()
      onCancel()
    }
  }, [onCancel])

  useEffect(() => {
    const {numero, suffixe, comment} = initialValue || {}
    resetNumero(numero)
    resetSuffixe(suffixe || '')
    resetComment(comment || '')
    setError(null)
  }, [resetNumero, resetSuffixe, resetComment, setError, initialValue])

  useEffect(() => {
    if (initialValue) {
      const positions = initialValue.positions.map(position => (
        {
          longitude: position.point.coordinates[0],
          latitude: position.point.coordinates[1],
          type: position.type
        }
      ))

      positions.forEach(position => addMarker(position))
    } else {
      addMarker({type: 'entrée'})
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setOverrideText(numero || null)
  }, [setOverrideText, numero])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <Pane display='flex'>
        <SelectField
          required
          label='Voie'
          flex={1}
          marginBottom={16}
          onChange={e => setVoieId(e.target.value)}
        >
          {sortBy(voies, v => normalizeSort(v.nom)).map(({_id, nom}) => (
            <option
              key={_id}
              selected={(initialVoieId === _id) || (initialValue && _id === initialValue.voie._id)}
              value={_id}
            >
              {nom}
            </option>
          ))}
        </SelectField>
      </Pane>

      <Pane display='flex'>
        <SelectField
          label='Toponyme'
          flex={1}
          marginBottom={16}
          onChange={({target}) => setToponymeId(target.value === REMOVE_TOPONYME_LABEL ? null : target.value)}
        >
          <option value={null}>{initialValue?.toponyme ? REMOVE_TOPONYME_LABEL : '- Choisir un toponyme -'}</option>
          {sortBy(toponymes, t => normalizeSort(t.nom)).map(({_id, nom}) => (
            <option
              key={_id}
              selected={_id === toponymeId}
              value={_id}
            >
              {nom}
            </option>
          ))}
        </SelectField>
      </Pane>

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
          placeholder={`Numéro${suggestedNumero ? ` recommandé : ${suggestedNumero}` : ''}`}
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
        <PositionEditor />
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
  initialVoieId: PropTypes.string,
  initialValue: PropTypes.shape({
    numero: PropTypes.number.isRequired,
    voie: PropTypes.string.isRequired,
    suffixe: PropTypes.string,
    comment: PropTypes.string,
    positions: PropTypes.array,
    toponyme: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

NumeroEditor.defaultProps = {
  initialValue: null,
  initialVoieId: null,
  onCancel: null
}

export default NumeroEditor
