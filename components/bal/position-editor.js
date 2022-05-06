import {useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Strong, Pane, Select, Heading, Icon, Small, TrashIcon, MapMarkerIcon, IconButton, Button, AddIcon, FormField} from 'evergreen-ui'

import {positionsTypesList} from '@/lib/positions-types-list'

import MarkersContext from '@/contexts/markers'

import InputLabel from '@/components/input-label'

function Position({marker, isRemovable, handleChange, onRemove}) {
  const onSelect = useCallback(e => {
    const type = e.target.value
    handleChange(marker._id, {...marker, type})
  }, [marker, handleChange])

  const removeMarker = useCallback(e => {
    e.preventDefault()
    onRemove(marker._id)
  }, [marker._id, onRemove])

  return (
    <>
      <Select
        value={marker.type}
        marginBottom={8}
        height={32}
        onChange={onSelect}
      >
        {positionsTypesList.map(positionType => (
          <option key={positionType.value} value={positionType.value}>
            {positionType.name}
          </option>
        ))}
      </Select>
      <Icon icon={MapMarkerIcon} size={22} margin='auto' />
      <Heading size={100} marginY='auto'>
        <Small>{marker.latitude && marker.latitude.toFixed(6)}</Small>
      </Heading>
      <Heading size={100} marginY='auto'>
        <Small>{marker.longitude && marker.longitude.toFixed(6)}</Small>
      </Heading>
      <IconButton
        disabled={isRemovable}
        appearance='default'
        iconSize={15}
        icon={TrashIcon}
        intent='danger'
        onClick={removeMarker}
      />
    </>
  )
}

Position.propTypes = {
  marker: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  isRemovable: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

function PositionEditor({initialPositions, isToponyme, validationMessage}) {
  const {markers, addMarker, updateMarker, removeMarker, disableMarkers} = useContext(MarkersContext)

  const handleAddMarker = useCallback(() => {
    addMarker({type: isToponyme ? 'segment' : 'entrée'})
  }, [isToponyme, addMarker])

  useEffect(() => {
    if (initialPositions) {
      const positions = initialPositions.map(position => (
        {
          longitude: position.point.coordinates[0],
          latitude: position.point.coordinates[1],
          type: position.type
        }
      ))

      positions.forEach(position => addMarker(position))
    } else {
      handleAddMarker()
    }

    return () => {
      disableMarkers()
    }
  }, [initialPositions, addMarker, handleAddMarker, disableMarkers])

  return (
    <FormField validationMessage={validationMessage}>
      <InputLabel
        title='Positions'
        help={markers.length > 1 ?
          'Déplacer les marqueurs sur la carte pour modifier les positions' :
          (markers.length === 1 ?
            `Déplacer le marqueur sur la carte pour déplacer le ${isToponyme ? 'toponyme' : 'numéro'}.` :
            `Déplacer le marqueur sur la carte pour placer le ${isToponyme ? 'toponyme' : 'numéro'}.`)}
      />

      {markers.length > 0 ? (
        <Pane display='grid' gridTemplateColumns='2fr .5fr 1fr 1fr .5fr'>
          <Strong fontWeight={400} paddingBottom='.5em'>Type</Strong>
          <div />
          <Strong fontWeight={400}>Latitude</Strong>
          <Strong fontWeight={400}>Longitude</Strong>
          <div />

          {markers.map(marker => (
            <Position
              key={marker._id}
              marker={marker}
              isRemovable={isToponyme ? false : markers.length === 1}
              handleChange={updateMarker}
              onRemove={removeMarker}
            />
          ))}
        </Pane>
      ) : (
        <Pane paddingBottom='.5em' textAlign='center'>
          <Heading size={400}>Ce toponyme n’a pas de position</Heading>
        </Pane>
      )}

      <Button
        type='button'
        iconBefore={AddIcon}
        appearance='primary'
        intent='success'
        width='100%'
        marginBottom={0}
        display='flex'
        justifyContent='center'
        onClick={handleAddMarker}
      >
        {`Ajouter une position au ${isToponyme ? 'toponyme' : 'numéro'}`}
      </Button>
    </FormField>
  )
}

PositionEditor.propTypes = {
  initialPositions: PropTypes.array,
  isToponyme: PropTypes.bool,
  validationMessage: PropTypes.string
}

PositionEditor.defaultProps = {
  initialPositions: null,
  isToponyme: false,
  validationMessage: null
}

export default PositionEditor
