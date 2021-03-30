import React, {useState, useMemo, useContext, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Alert, TextInputField} from 'evergreen-ui'

import MarkersContext from '../../contexts/markers'

import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'
import useKeyEvent from '../../hooks/key-event'

import PositionEditor from './position-editor'

function ToponymeEditor({initialValue, onSubmit, onCancel}) {
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput(initialValue ? initialValue.nom : '')
  const [error, setError] = useState()
  const setRef = useFocus()

  const {markers, addMarker, disableMarkers} = useContext(MarkersContext)

  const onFormSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    const body = {
      nom,
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
      disableMarkers()

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
  }, [router, nom, markers, onSubmit, disableMarkers])

  const onFormCancel = useCallback(e => {
    e.preventDefault()

    disableMarkers()
    onCancel()
  }, [onCancel, disableMarkers])

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
    if (initialValue) {
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Pane is='form' onSubmit={onFormSubmit}>
      <TextInputField
        ref={setRef}
        required
        label='Nom du toponyme'
        display='block'
        disabled={isLoading}
        width='100%'
        maxWidth={500}
        value={nom}
        maxLength={200}
        marginBottom={16}
        placeholder='Nom du toponyme…'
        onChange={onNomChange}
      />

      <PositionEditor isToponyme />

      {alert && (
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

ToponymeEditor.propTypes = {
  initialValue: PropTypes.shape({
    nom: PropTypes.string,
    complement: PropTypes.string,
    typeNumerotation: PropTypes.string,
    trace: PropTypes.object,
    positions: PropTypes.array.isRequired
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
}

ToponymeEditor.defaultProps = {
  initialValue: null,
  onCancel: null
}

export default ToponymeEditor
