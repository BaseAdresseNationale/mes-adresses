import React, {useState, useMemo, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Pane, Button, Checkbox, Alert} from 'evergreen-ui'

import DrawContext from '../../contexts/draw'

import {useInput, useCheckboxInput} from '../../hooks/input'
import useKeyEvent from '../../hooks/key-event'

import AssistedTextField from '../assisted-text-field'

import DrawEditor from './draw-editor'

function VoieEditor({initialValue, onSubmit, onCancel}) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isMetric, onIsMetricChange] = useCheckboxInput(initialValue ? initialValue.typeNumerotation === 'metrique' : false)
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const [error, setError] = useState()

  const {drawEnabled, data, enableDraw, disableDraw, setModeId} = useContext(DrawContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const body = {
      nom,
      typeNumerotation: isMetric ? 'metrique' : 'numerique',
      trace: data ? data.geometry : null
    }

    try {
      await onSubmit(body)

      const {balId, codeCommune} = router.query
      router.push(
        `/bal/commune?balId=${balId}&codeCommune=${codeCommune}`,
        `/bal/${balId}/communes/${codeCommune}`
      )
    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
  }, [router, nom, isMetric, data, onSubmit])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    onCancel()
  }, [onCancel])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return 'Enregistrer'
  }, [isLoading])

  useKeyEvent('keyup', ({key}) => {
    if (key === 'Escape') {
      onCancel()
    }
  }, [onCancel])

  useEffect(() => {
    if (isMetric) {
      setModeId(data ? 'editing' : 'drawLineString')
      enableDraw()
    } else if (!isMetric && drawEnabled) {
      disableDraw()
    }
  }, [data, disableDraw, drawEnabled, enableDraw, isMetric, setModeId])

  useEffect(() => {
    return () => {
      disableDraw()
    }
  }, [disableDraw])

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <AssistedTextField
        isFocus
        label='Nom de la voie'
        placeholder='Nom de la voie'
        value={nom}
        onChange={onNomChange}
      />

      <Checkbox
        checked={isMetric}
        label='Cette voie utilise la numérotation métrique'
        onChange={onIsMetricChange}
      />

      {isMetric && (
        <DrawEditor trace={initialValue ? initialValue.trace : null} />
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
    typeNumerotation: PropTypes.string,
    trace: PropTypes.object
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

VoieEditor.defaultProps = {
  initialValue: null,
  onCancel: null
}

export default VoieEditor
