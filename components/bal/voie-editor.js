import {useState, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import router from 'next/router'
import {Button, Checkbox, AddIcon} from 'evergreen-ui'
import {uniqueId} from 'lodash'

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
import LanguageField from './language-field'

// Const nomVoieAlt = {bre: 'Gwidel', cos: 'Carghjese'}
const nomVoieAlt = null
function VoieEditor({initialValue, closeForm}) {
  // Const initialLanguageList = initialValue.nomVoieAlt && Object.keys(initialValue.nomVoieAlt).map(language => {
  //   return {label: initialValue.nomVoieAlt[language], value: language, disabled: true, id: uniqueId()}
  // })

  const initialLanguageList = nomVoieAlt && Object.keys(nomVoieAlt).map(language => {
    return {label: nomVoieAlt[language], value: language, disabled: true, id: uniqueId()}
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isMetric, onIsMetricChange] = useCheckboxInput(initialValue ? initialValue.typeNumerotation === 'metrique' : false)
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const [getValidationMessage, setValidationMessages] = useValidationMessage()
  const [selectedLanguages, setSelectedLanguages] = useState(initialLanguageList || [])

  const {token} = useContext(TokenContext)
  const {baseLocale, refreshBALSync, reloadVoies, reloadGeojson, setVoie} = useContext(BalDataContext)
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
        async () => addVoie(baseLocale._id, body, token)
      const {validationMessages, ...voie} = await submit()

      setValidationMessages(validationMessages)

      refreshBALSync()

      if (initialValue?._id === voie._id && router.query.idVoie) {
        setVoie(voie)
      } else {
        await reloadVoies()
        await reloadGeojson()
      }

      setIsLoading(false)
      closeForm()
    } catch {
      setIsLoading(false)
    }
  }, [baseLocale._id, initialValue, nom, isMetric, data, token, closeForm, setValidationMessages, setVoie, reloadVoies, reloadGeojson, refreshBALSync])

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
      setModeId(data ? 'editing' : 'drawLineString')
      enableDraw()
    } else if (!isMetric && drawEnabled) {
      disableDraw()
    }
  }, [data, disableDraw, drawEnabled, enableDraw, isMetric, setModeId])

  const onUnmount = useCallback(() => {
    disableDraw()
  }, [disableDraw])

  const onAddLanguage = () => {
    setSelectedLanguages([...selectedLanguages, {label: '', value: '', disabled: false, id: uniqueId()}])
  }

  const handleLanguageSelect = (codeISO, index) => {
    selectedLanguages[index].value = codeISO
    setSelectedLanguages([...selectedLanguages])
  }

  const handleLanguageChange = (event, index) => {
    selectedLanguages[index].label = event.target.value
    setSelectedLanguages([...selectedLanguages])
  }

  const removeLanguage = index => {
    selectedLanguages.splice(index, 1)
    setSelectedLanguages([...selectedLanguages])
  }

  return (
    <FormMaster editingId={initialValue?._id} unmountForm={onUnmount} closeForm={closeForm}>
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
            checked={isMetric}
            label='Cette voie utilise la numérotation métrique'
            onChange={onIsMetricChange}
            marginBottom='1em'
          />

          {selectedLanguages.map((field, index) => {
            return (
              <LanguageField
                key={field.id}
                index={index}
                field={field}
                selectedLanguages={selectedLanguages}
                handleLanguageChange={handleLanguageChange}
                handleLanguageSelect={handleLanguageSelect}
                removeLanguage={removeLanguage}
              />
            )
          })}
          <Button
            type='button'
            appearance='primary'
            intent='success'
            iconBefore={AddIcon}
            width='100%'
            onClick={onAddLanguage}
          >
            Ajouter une langue régionale
          </Button>
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
    </FormMaster>
  )
}

VoieEditor.propTypes = {
  initialValue: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    typeNumerotation: PropTypes.string,
    nomVoieAlt: PropTypes.object,
    trace: PropTypes.object
  }),
  closeForm: PropTypes.func.isRequired
}

VoieEditor.defaultProps = {
  initialValue: null
}

export default VoieEditor
