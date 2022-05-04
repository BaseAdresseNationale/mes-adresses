import {useState, useMemo, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {Button} from 'evergreen-ui'

import {addToponyme, editToponyme} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'
import BalDataContext from '@/contexts/bal-data'
import MarkersContext from '@/contexts/markers'
import ParcellesContext from '@/contexts/parcelles'

import {useInput} from '@/hooks/input'
import useKeyEvent from '@/hooks/key-event'

import AssistedTextField from '@/components/assisted-text-field'
import Form from '@/components/form'
import FormInput from '@/components/form-input'
import PositionEditor from '@/components/bal/position-editor'
import SelectParcelles from '@/components/bal/numero-editor/select-parcelles'

function ToponymeEditor({initialValue, closeForm}) {
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange, resetNom] = useInput(initialValue?.nom || '')
  const [validationMessages, setValidationMessages] = useState(null)

  const router = useRouter()

  const {token} = useContext(TokenContext)
  const {baseLocale, commune, setToponyme, setIsEditing, setEditingId, reloadToponymes, refreshBALSync, reloadGeojson} = useContext(BalDataContext)
  const {markers, addMarker, disableMarkers} = useContext(MarkersContext)
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

      if (validationMessages) {
        setValidationMessages(validationMessages)
        throw new Error('Invalid Payload')
      } else {
        refreshBALSync()

        if (initialValue && initialValue._id === router.query.idToponyme) {
          setToponyme(toponyme)
        } else {
          await reloadToponymes()
          await reloadGeojson()
        }

        setIsLoading(false)
        closeForm()
      }
    } catch {
      setIsLoading(false)
    }
  }, [token, baseLocale._id, commune.code, initialValue, nom, markers, selectedParcelles, router, setToponyme, closeForm, refreshBALSync, reloadToponymes, reloadGeojson])

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

  useKeyEvent(({key}) => {
    if (key === 'Escape') {
      closeForm()
    }
  }, [closeForm], 'keyup')

  useEffect(() => {
    const {nom, parcelles} = initialValue || {}
    resetNom(nom || '')
    setSelectedParcelles(parcelles || [])
    setValidationMessages(null)
  }, [resetNom, setValidationMessages, setSelectedParcelles, initialValue])

  useEffect(() => {
    setIsEditing(true)
    setIsParcelleSelectionEnabled(true)

    if (initialValue) {
      setEditingId(initialValue._id)
      const positions = initialValue.positions.map(position => (
        {
          longitude: position.point.coordinates[0],
          latitude: position.point.coordinates[1],
          type: position.type
        }
      ))

      positions.forEach(position => addMarker(position))
    } else {
      addMarker({type: 'segment'})
    }

    return () => {
      setEditingId(null)
      setIsEditing(false)
      disableMarkers()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form onFormSubmit={onFormSubmit}>
      <FormInput>
        <AssistedTextField
          isFocus
          dsiabled={isLoading}
          label='Nom du toponyme'
          placeholder='Nom du toponyme'
          value={nom}
          onChange={onNomChange}
          validationMessage={validationMessages?.nom[0]}
        />
      </FormInput>

      <FormInput>
        <PositionEditor isToponyme />
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
