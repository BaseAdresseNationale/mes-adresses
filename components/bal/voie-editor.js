import {useState, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Checkbox, Alert} from 'evergreen-ui'

import DrawContext from '@/contexts/draw'

import {useInput, useCheckboxInput} from '@/hooks/input'
import useKeyEvent from '@/hooks/key-event'

import Form from '@/components/form'
import FormInput from '@/components/form-input'
import AssistedTextField from '@/components/assisted-text-field'
import DrawEditor from '@/components/bal/draw-editor'

function VoieEditor({initialValue, onSubmit, onCancel}) {
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
    } catch (error) {
      setIsLoading(false)
      setError(error.message)
    }
  }, [nom, isMetric, data, onSubmit])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    onCancel()
  }, [onCancel])

  useKeyEvent(({key}) => {
    if (key === 'Escape') {
      onCancel()
    }
  }, [onCancel], 'keyup')

  useEffect(() => {
    if (isMetric) {
      setModeId(data ? 'editing' : 'drawLineString')
      enableDraw()
    } else if (!isMetric && drawEnabled) {
      disableDraw()
    }
  }, [data, disableDraw, drawEnabled, enableDraw, isMetric, setModeId])

  // Disable edit mode on component unmount
  useEffect(() => {
    return () => {
      disableDraw()
      onCancel()
    }
  }, [onCancel, disableDraw])

  return (
    <Form onFormSubmit={onFormSubmit}>
      <FormInput>
        <AssistedTextField
          isFocus
          label='Nom de la voie'
          placeholder='Nom de la voie'
          value={nom}
          onChange={onNomChange}
        />

        <Checkbox
          marginBottom={0}
          checked={isMetric}
          label='Cette voie utilise la numérotation métrique'
          onChange={onIsMetricChange}
        />
      </FormInput>

      {isMetric && (
        <DrawEditor trace={initialValue ? initialValue.trace : null} />
      )}

      {error && (
        <Alert marginBottom={16} intent='danger' title='Erreur'>
          {error}
        </Alert>
      )}

      <Button isLoading={isLoading} type='submit' appearance='primary' intent='success'>
        {isLoading ? 'En cours…' : 'Enregistrer'}
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
    </Form>
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
