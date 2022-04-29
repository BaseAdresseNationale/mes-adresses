import {useState, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button, Checkbox} from 'evergreen-ui'

import {editVoie} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import DrawContext from '@/contexts/draw'
import TokenContext from '@/contexts/token'

import {useInput, useCheckboxInput} from '@/hooks/input'
import useKeyEvent from '@/hooks/key-event'

import Form from '@/components/form'
import FormInput from '@/components/form-input'
import AssistedTextField from '@/components/assisted-text-field'
import DrawEditor from '@/components/bal/draw-editor'

function VoieEditor({initialValue, closeForm}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMetric, onIsMetricChange] = useCheckboxInput(initialValue ? initialValue.typeNumerotation === 'metrique' : false)
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const [validationMessages, setValidationMessages] = useState(null)

  const {token} = useContext(TokenContext)
  const {refreshBALSync, reloadVoies, reloadGeojson, setVoie} = useContext(BalDataContext)
  const {drawEnabled, data, enableDraw, disableDraw, setModeId} = useContext(DrawContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setValidationMessages(null)
    setIsLoading(true)

    try {
      const {validationMessages, ...updatedVoie} = await editVoie(initialValue._id, {
        nom,
        typeNumerotation: isMetric ? 'metrique' : 'numerique',
        trace: data ? data.geometry : null
      }, token)

      if (validationMessages) {
        setValidationMessages(validationMessages)
        throw new Error('Invalid Payload')
      } else {
        await reloadVoies()
        await reloadGeojson()
        refreshBALSync()

        setVoie(updatedVoie)
        closeForm()
      }
    } catch {}

    setIsLoading(false)
  }, [initialValue._id, nom, isMetric, data, token, closeForm, setVoie, reloadVoies, reloadGeojson, refreshBALSync])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    closeForm()
  }, [closeForm])

  // Reset validation messages on changes
  useEffect(() => {
    setValidationMessages(null)
  }, [nom])

  useKeyEvent(({key}) => {
    if (key === 'Escape') {
      closeForm()
    }
  }, [closeForm], 'keyup')

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
    <Form onFormSubmit={onFormSubmit}>
      <FormInput>
        <AssistedTextField
          isFocus
          label='Nom de la voie'
          placeholder='Nom de la voie'
          value={nom}
          onChange={onNomChange}
          validationMessage={validationMessages?.nom[0]}
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

      <Button isLoading={isLoading} type='submit' appearance='primary' intent='success'>
        {isLoading ? 'En cours…' : 'Enregistrer'}
      </Button>

      {closeForm && (
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
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string,
    typeNumerotation: PropTypes.string,
    trace: PropTypes.object
  }),
  closeForm: PropTypes.func.isRequired
}

VoieEditor.defaultProps = {
  initialValue: null
}

export default VoieEditor
