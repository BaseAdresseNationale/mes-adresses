import {useState, useMemo, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'evergreen-ui'

import {addToponyme, editToponyme} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'
import MarkersContext from '@/contexts/markers'
import ParcellesContext from '@/contexts/parcelles'

import {useInput} from '@/hooks/input'
import useValidationMessage from '@/hooks/validation-messages'

import FormMaster from '@/components/form-master'
import Form from '@/components/form'
import AssistedTextField from '@/components/assisted-text-field'
import FormInput from '@/components/form-input'
import PositionEditor from '@/components/bal/position-editor'
import SelectParcelles from '@/components/bal/numero-editor/select-parcelles'

function ToponymeEditor({initialValue, closeForm}) {
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange, resetNom] = useInput(initialValue?.nom || '')
  const [getValidationMessage, setValidationMessages] = useValidationMessage(null)

  const {token} = useContext(TokenContext)
  const {baseLocale, commune, setToponyme, reloadToponymes, refreshBALSync, reloadGeojson} = useContext(BalDataContext)
  const {markers} = useContext(MarkersContext)
  const {selectedParcelles, setSelectedParcelles, setIsParcelleSelectionEnabled} = useContext(ParcellesContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setValidationMessages(null)
    setIsLoading(true)

    const body = {
      nom,
      positions: [],
      parcelles: selectedParcelles
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
      // Add or edit a toponyme
      const submit = initialValue ?
        async () => editToponyme(initialValue._id, body, token) :
        async () => addToponyme(baseLocale._id, commune.code, body, token)
      const {validationMessages, ...toponyme} = await submit()
      setValidationMessages(validationMessages)

      refreshBALSync()

      if (initialValue?._id === toponyme._id) {
        setToponyme(toponyme)
      } else {
        await reloadToponymes()
        await reloadGeojson()
      }

      setIsLoading(false)
      closeForm()
    } catch {
      setIsLoading(false)
    }
  }, [token, baseLocale._id, commune.code, initialValue, nom, markers, selectedParcelles, setToponyme, closeForm, refreshBALSync, reloadToponymes, reloadGeojson, setValidationMessages])

  const onFormCancel = useCallback(e => {
    e.preventDefault()
    closeForm()
  }, [closeForm])

  const submitLabel = useMemo(() => {
    if (isLoading) {
      return 'En cours…'
    }

    return 'Enregistrer'
  }, [isLoading])

  useEffect(() => {
    const {nom, parcelles} = initialValue || {}
    resetNom(nom || '')
    setSelectedParcelles(parcelles || [])
    setValidationMessages(null)
  }, [resetNom, setValidationMessages, setSelectedParcelles, initialValue])

  const onMount = useCallback(() => {
    setIsParcelleSelectionEnabled(true)
  }, [setIsParcelleSelectionEnabled])

  return (
    <FormMaster editingId={initialValue?._id} mountForm={onMount} closeForm={closeForm}>
      <Form onFormSubmit={onFormSubmit}>
        <FormInput>
          <AssistedTextField
            isFocus
            dsiabled={isLoading}
            label='Nom du toponyme'
            placeholder='Nom du toponyme'
            value={nom}
            onChange={onNomChange}
            validationMessage={getValidationMessage('nom')}
          />
        </FormInput>

        <FormInput>
          <PositionEditor
            initialPositions={initialValue?.positions}
            isToponyme
            validationMessage={getValidationMessage('positions')}
          />
        </FormInput>

        <FormInput>
          <SelectParcelles isToponyme />
        </FormInput>

        <Button isLoading={isLoading} type='submit' appearance='primary' intent='success'>
          {submitLabel}
        </Button>

        <Button
          disabled={isLoading}
          appearance='minimal'
          marginLeft={8}
          display='inline-flex'
          onClick={onFormCancel}
        >
          Annuler
        </Button>
      </Form>
    </FormMaster>
  )
}

ToponymeEditor.propTypes = {
  initialValue: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    parcelles: PropTypes.array.isRequired,
    positions: PropTypes.array.isRequired
  }),
  closeForm: PropTypes.func.isRequired
}

ToponymeEditor.defaultProps = {
  initialValue: null
}

export default ToponymeEditor
