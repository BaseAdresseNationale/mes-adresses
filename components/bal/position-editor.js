import React from 'react'
import PropTypes from 'prop-types'
import {Strong, Pane, SelectField, Heading, Icon, Small, TrashIcon, MapMarkerIcon, IconButton, Button, AddIcon, Tooltip} from 'evergreen-ui'

import {positionsTypesList} from '../../lib/positions-types-list'

function PositionEditor({markers, enableMarkers}) {
  const handleAddMarker = () => {
    enableMarkers([...markers, {type: 'entrée'}])
  }

  const handleChange = (e, idx) => {
    e.preventDefault()
    markers[idx] = {
      ...markers[idx],
      type: e.target.value
    }

    enableMarkers(markers)
  }

  const deletePosition = (e, idx) => {
    e.preventDefault()
    const markersCopy = markers.filter(marker => marker !== markers[idx])

    enableMarkers(markersCopy)
  }

  return (
    <>
      <Pane display='grid' gridTemplateColumns='2fr .5fr 1fr 1fr .5fr'>
        <Strong fontWeight={400}>Type</Strong>
        <Strong />
        <Strong fontWeight={400}>Latitude</Strong>
        <Strong fontWeight={400}>Longitude</Strong>
        <Strong />

        {markers.map((marker, idx) => (
          <>
            <SelectField
              defaultValue={marker.type}
              marginBottom={8}
              height={32}
              onChange={e => handleChange(e, idx)}
            >
              {positionsTypesList.map(positionType => (
                <option key={positionType.value} value={positionType.value} selected={marker.type === positionType.value}>{positionType.name}</option>
              ))}
            </SelectField>
            <Icon icon={MapMarkerIcon} size={22} margin='auto' />
            <Heading size={100} marginY='auto'>
              <Small>{marker.latitude && marker.latitude.toFixed(6)}</Small>
            </Heading>
            <Heading size={100} marginY='auto'>
              <Small>{marker.longitude && marker.longitude.toFixed(6)}</Small>
            </Heading>
            <IconButton
              disabled={markers.length === 1}
              appearance='default'
              iconSize={15}
              icon={TrashIcon}
              intent='danger'
              onClick={e => deletePosition(e, idx)}
            />
          </>
        ))}

      </Pane>
      <Button
        type='button'
        iconBefore={AddIcon}
        appearance='primary'
        intent='success'
        width='100%'
        marginBottom={16}
        display='flex'
        justifyContent='center'
        onClick={handleAddMarker}
      >
        Ajouter une position au numéro
      </Button>
    </>
  )
}

PositionEditor.propTypes = {
  markers: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    type: PropTypes.string
  })).isRequired,
  enableMarkers: PropTypes.func.isRequired
}

export default PositionEditor
