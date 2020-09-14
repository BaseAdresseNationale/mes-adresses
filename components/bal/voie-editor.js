import React, {useState, useMemo, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Checkbox, Alert, TextInputField} from 'evergreen-ui'

import {checkIsToponyme} from '../../lib/voie'

import DrawContext from '../../contexts/draw'
import MarkerContext from '../../contexts/marker'

import {useInput, useCheckboxInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import PositionEditor from './position-editor'
import DrawEditor from './draw-editor'

function VoieEditor({initialValue, onSubmit, onCancel, isEnabledComplement}) {
  const position = initialValue ? initialValue.positions[0] : null

  const [isLoading, setIsLoading] = useState(false)
  const [isToponyme, onIsToponymeChange] = useCheckboxInput(checkIsToponyme(initialValue))
  const [isMetric, onIsMetricChange] = useCheckboxInput(initialValue ? initialValue.typeNumerotation === 'metrique' : false)
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const [complement, onComplementChange] = useInput(initialValue ? initialValue.complement : '')
  const [positionType, onPositionTypeChange] = useInput(position ? position.type : 'entrée')
  const [error, setError] = useState()
  const setRef = useFocus()

  const {data, enableDraw, disableDraw, setModeId, setData} = useContext(DrawContext)
  const {
    enabled,
    marker,
    enableMarker,
    disableMarker
  } = useContext(MarkerContext)

  const onUnmount = useCallback(() => {
    disableMarker()
    disableDraw()
  }, [disableDraw, disableMarker])

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const body = {
      nom,
      typeNumerotation: isMetric ? 'metrique' : 'numerique',
      complement: complement.length > 1 ? complement : null,
      trace: data ? data.geometry : null
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
      onUnmount()
    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
  }, [nom, isMetric, complement, data, marker, positionType, onSubmit, onUnmount])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    onUnmount()
    onCancel()
  }, [onCancel, onUnmount])

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

  useEffect(() => {
    if (isToponyme) {
      enableMarker(position)
    } else {
      disableMarker()
    }
  }, [enabled, initialValue, disableMarker, enableMarker, isToponyme, position])

  useEffect(() => {
    if (isMetric) {
      onIsToponymeChange({target: {checked: false}})

      setModeId(data ? 'editing' : 'drawLineString')
      enableDraw()
    } else {
      disableDraw()
    }
  }, [data, disableDraw, enableDraw, isMetric, onIsToponymeChange, setData, setModeId])

  useEffect(() => {
    if (isToponyme) {
      onIsMetricChange({target: {checked: false}})
    }
  }, [isToponyme, onIsMetricChange])

  useEffect(() => {
    return () => {
      disableDraw()
    }
  }, [disableDraw])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <TextInputField
        required
        label='Nom de la voie'
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
      {isEnabledComplement && (
        <TextInputField
          display='block'
          disabled={isLoading}
          width='100%'
          maxWidth={500}
          label='Complément d’adresse'
          value={complement}
          maxLength={200}
          marginBottom={16}
          placeholder='Complément du nom de voie (lieu-dit, hameau, …)'
          onChange={onComplementChange}
        />
      )}

      <Checkbox
        checked={isMetric}
        label='Cette voie utilise la numérotation métrique'
        onChange={onIsMetricChange}
      />

      {!initialValue && (
        <Checkbox
          checked={isToponyme}
          label='Cette voie est un toponyme'
          onChange={onIsToponymeChange}
        />
      )}

      {isMetric && (
        <DrawEditor trace={initialValue ? initialValue.trace : null} />
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
        <Button
          disabled={isLoading}
          appearance='minimal'
          marginLeft={8}
          display='inline-flex'
          onClick={onFormCancel}
        >
          Annuler
        </Button>
      )}
    </Pane>
  )
}

VoieEditor.propTypes = {
  initialValue: PropTypes.shape({
    nom: PropTypes.string,
    complement: PropTypes.string,
    typeNumerotation: PropTypes.string,
    trace: PropTypes.object,
    positions: PropTypes.array.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isEnabledComplement: PropTypes.bool
}

VoieEditor.defaultProps = {
  initialValue: null,
  onCancel: null,
  isEnabledComplement: false
}

export default VoieEditor
