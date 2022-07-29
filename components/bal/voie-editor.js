import {useState, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import router from 'next/router'
import {isEqual} from 'lodash'
import {Pane, Button, Checkbox} from 'evergreen-ui'

import {addVoie, editVoie} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import DrawContext from '@/contexts/draw'
import TokenContext from '@/contexts/token'

import {useInput, useCheckboxInput} from '@/hooks/input'
import useValidationMessage from '@/hooks/validation-messages'

import FormMaster from '@/components/form-master'
import Form from '@/components/form'
import FormInput from '@/components/form-input'
import AssistedTextField from '@/components/assisted-text-field'
import DrawEditor from '@/components/bal/draw-editor'
import LanguesRegionalesForm from '@/components/langues-regionales-form'

function VoieEditor({initialValue, closeForm}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isMetric, onIsMetricChange] = useCheckboxInput(initialValue ? initialValue.typeNumerotation === 'metrique' : false)
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const [getValidationMessage, setValidationMessages] = useValidationMessage()
  const [nomAlt, setNomAlt] = useState(initialValue?.nomAlt)
  const {token} = useContext(TokenContext)
  const {baseLocale, refreshBALSync, reloadVoies, reloadGeojson, setVoie} = useContext(BalDataContext)
  const {drawEnabled, data, enableDraw, disableDraw} = useContext(DrawContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setValidationMessages(null)
    setIsLoading(true)

    try {
      const body = {
        nom,
        nomAlt: Object.keys(nomAlt).length > 0 ? nomAlt : null,
        typeNumerotation: isMetric ? 'metrique' : 'numerique',
        trace: data ? data.geometry : null
      }

      // Add or edit a voie
      const submit = initialValue ?
        async () => editVoie(initialValue._id, body, token) :
        async () => addVoie(baseLocale._id, body, token)
      const {validationMessages, ...voie} = await submit()

      setValidationMessages(validationMessages)

      refreshBALSync()

      if (initialValue?._id === voie._id && router.query.idVoie) {
        setVoie(voie)

        // Reload voie trace
        if (!isEqual(initialValue.trace, data?.geometry) || body.typeNumerotation !== initialValue.typeNumerotation) {
          await reloadGeojson()
        }
      } else {
        await reloadVoies()
        await reloadGeojson()
      }

      setIsLoading(false)
      closeForm()
    } catch {
      setIsLoading(false)
    }
  }, [baseLocale._id, initialValue, nom, isMetric, data, token, nomAlt, closeForm, setValidationMessages, setVoie, reloadVoies, reloadGeojson, refreshBALSync])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    closeForm()
  }, [closeForm])

  // Reset validation messages on changes
  useEffect(() => {
    setValidationMessages(null)
  }, [nom, setValidationMessages])

  useEffect(() => {
    if (isMetric) {
      enableDraw(initialValue)
    } else if (!isMetric && drawEnabled) {
      disableDraw()
    }
  }, [initialValue, disableDraw, drawEnabled, enableDraw, isMetric])

  const onUnmount = useCallback(() => {
    disableDraw()
  }, [disableDraw])

  return (
    <FormMaster editingId={initialValue?._id} unmountForm={onUnmount} closeForm={closeForm}>
      <Form onFormSubmit={onFormSubmit}>
        <Pane maxHeight={400} overflowY='scroll'>
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
              checked={isMetric}
              label='Cette voie utilise la numérotation métrique'
              onChange={onIsMetricChange}
              marginBottom='1em'
            />

            <LanguesRegionalesForm initialValue={initialValue?.nomAlt} handleLanguages={setNomAlt} />
          </FormInput>

          {isMetric && (
            <DrawEditor trace={initialValue ? initialValue.trace : null} />
          )}
        </Pane>

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
    </FormMaster>
  )
}

VoieEditor.propTypes = {
  initialValue: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    typeNumerotation: PropTypes.string,
    nomAlt: PropTypes.object,
    trace: PropTypes.object
  }),
  closeForm: PropTypes.func.isRequired
}

VoieEditor.defaultProps = {
  initialValue: null
}

export default VoieEditor
