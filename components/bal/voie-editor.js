import {useState, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Button, Checkbox} from 'evergreen-ui'

import {addVoie, editVoie} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import DrawContext from '@/contexts/draw'
import TokenContext from '@/contexts/token'

import {useInput, useCheckboxInput} from '@/hooks/input'
import useKeyEvent from '@/hooks/key-event'
import useValidationMessage from '@/hooks/validation-messages'

import Form from '@/components/form'
import FormInput from '@/components/form-input'
import AssistedTextField from '@/components/assisted-text-field'
import DrawEditor from '@/components/bal/draw-editor'

function VoieEditor({initialValue, closeForm}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMetric, onIsMetricChange] = useCheckboxInput(initialValue ? initialValue.typeNumerotation === 'metrique' : false)
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const [getValidationMessage, setValidationMessages] = useValidationMessage()

  const router = useRouter()

  const {token} = useContext(TokenContext)
  const {baseLocale, commune, setEditingId, setIsEditing, refreshBALSync, reloadVoies, reloadGeojson, setVoie} = useContext(BalDataContext)
  const {drawEnabled, data, enableDraw, disableDraw, setModeId} = useContext(DrawContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setValidationMessages(null)
    setIsLoading(true)

    try {
      const body = {
        nom,
        typeNumerotation: isMetric ? 'metrique' : 'numerique',
        trace: data ? data.geometry : null
      }

      // Add or edit a voie
      const submit = initialValue ?
        async () => editVoie(initialValue._id, body, token) :
        async () => addVoie(baseLocale._id, commune.code, body, token)
      const {validationMessages, ...updatedVoie} = await submit()

      setValidationMessages(validationMessages)

      refreshBALSync()

      if (initialValue && initialValue._id === router.query.idVoie) {
        setVoie(updatedVoie)
      } else {
        await reloadVoies()
        await reloadGeojson()
      }

      setIsLoading(false)
      closeForm()
    } catch {
      setIsLoading(false)
    }
  }, [router, baseLocale._id, commune.code, initialValue, nom, isMetric, data, token, closeForm, setValidationMessages, setVoie, reloadVoies, reloadGeojson, refreshBALSync])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    closeForm()
  }, [closeForm])

  // Reset validation messages on changes
  useEffect(() => {
    setValidationMessages(null)
  }, [nom, setValidationMessages])

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
    if (initialValue) {
      setEditingId(initialValue._id)
    }

    setIsEditing(true)
    return () => {
      disableDraw()
      setEditingId(null)
      setIsEditing(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form onFormSubmit={onFormSubmit}>
      <FormInput>
        <AssistedTextField
          isFocus
          label='Nom de la voie'
          placeholder='Nom de la voie'
          value={nom}
          onChange={onNomChange}
          validationMessage={getValidationMessage('nom')}
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
    nom: PropTypes.string.isRequired,
    typeNumerotation: PropTypes.string,
    trace: PropTypes.object
  }),
  closeForm: PropTypes.func.isRequired
}

VoieEditor.defaultProps = {
  initialValue: null
}

export default VoieEditor
