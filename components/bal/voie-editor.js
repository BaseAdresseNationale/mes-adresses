import React, {useState, useMemo, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Pane, Button, Checkbox, Alert, TextInputField} from 'evergreen-ui'

import {checkIsToponyme} from '../../lib/voie'

import DrawContext from '../../contexts/draw'
import MarkersContext from '../../contexts/markers'

import {useInput, useCheckboxInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import PositionEditor from './position-editor'
import DrawEditor from './draw-editor'

function VoieEditor({initialValue, onSubmit, onCancel, hasNumeros, isEnabledComplement}) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isToponyme, onIsToponymeChange] = useCheckboxInput(checkIsToponyme(initialValue))
  const [isMetric, onIsMetricChange] = useCheckboxInput(initialValue ? initialValue.typeNumerotation === 'metrique' : false)
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const [complement, onComplementChange] = useInput(initialValue ? initialValue.complement : '')
  const [error, setError] = useState()
  const setRef = useFocus()

  const {data, enableDraw, disableDraw, setModeId, setData} = useContext(DrawContext)
  const {markers, addMarker, disableMarkers} = useContext(MarkersContext)

  const onUnmount = useCallback(() => {
    disableMarkers()
    disableDraw()
  }, [disableDraw, disableMarkers])

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const body = {
      nom,
      typeNumerotation: isMetric ? 'metrique' : 'numerique',
      complement: complement.length > 1 ? complement : null,
      trace: data ? data.geometry : null,
      positions: []
    }

    if (markers) {
      markers.forEach(marker => {
        body.positions.push(
          {
            point: {
              type: 'Point',
              coordinates: [marker.longitude, marker.latitude]
            },
            type: marker.type
          }
        )
      })
    }

    try {
      await onSubmit(body)
      onUnmount()

      if (body.positions.length > 0) {
        const {balId, codeCommune} = router.query
        router.push(
          `/bal/commune?balId=${balId}&codeCommune=${codeCommune}`,
          `/bal/${balId}/communes/${codeCommune}`
        )
      }
    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
  }, [router, nom, isMetric, complement, data, markers, onSubmit, onUnmount])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    onUnmount()
    onCancel()
  }, [onCancel, onUnmount])

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
    if (isToponyme && initialValue && initialValue.positions.length > 0) {
      const positions = initialValue.positions.map(position => (
        {
          longitude: position.point.coordinates[0],
          latitude: position.point.coordinates[1],
          type: position.type
        }
      ))

      positions.forEach(position => addMarker(position))
    } else if (isToponyme) {
      addMarker({type: 'segment'})
    } else {
      disableMarkers()
    }
  }, [initialValue, disableMarkers, addMarker, isToponyme])

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
        ref={setRef}
        required
        label='Nom de la voie'
        display='block'
        disabled={isLoading}
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

      {(isToponyme || !hasNumeros) && (
        <Checkbox
          checked={isToponyme}
          label='Cette voie est un toponyme'
          onChange={onIsToponymeChange}
        />
      )}

      {isMetric && (
        <DrawEditor trace={initialValue ? initialValue.trace : null} />
      )}

      {isToponyme && markers.length > 0 && (
        <PositionEditor isToponyme />
      )}

      {alert && isToponyme && (
        <Alert marginBottom={16}>
          {initialValue ?
            'Déplacer le marqueur sur la carte pour déplacer le toponyme.' :
            'Déplacer le marqueur sur la carte pour placer le toponyme.'
          }
        </Alert>
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
  isEnabledComplement: PropTypes.bool,
  hasNumeros: PropTypes.bool
}

VoieEditor.defaultProps = {
  initialValue: null,
  onCancel: null,
  isEnabledComplement: false,
  hasNumeros: false
}

export default VoieEditor
