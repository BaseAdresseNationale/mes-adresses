import React, {useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, MapMarkerIcon, Text} from 'evergreen-ui'

import MarkersContext from '../../contexts/markers'

function EditableMarker({viewport, size, style}) {
  const {enabled, markers, setMarkers} = useContext(MarkersContext)

  const onDrag = useCallback((event, idx) => {
    const [longitude, latitude] = event.lngLat
    setMarkers(prevMarkers => {
      const newMarkers = [...prevMarkers]
      newMarkers[idx] = {
        _id: newMarkers[idx]._id,
        longitude,
        latitude,
        type: newMarkers[idx].type
      }

      return newMarkers
    })
  }, [setMarkers])

  const addDefaultPosition = useCallback(() => {
    setMarkers(markers => {
      return markers.map(marker => {
        if (!marker.latitude || !marker.longitude) {
          const {latitude, longitude} = viewport
          return {...marker, latitude, longitude}
        }

        return marker
      })
    })
  }, [setMarkers, viewport])

  if (!enabled || markers.length === 0) {
    return null
  }

  if (markers.find(({latitude, longitude}) => !longitude || !latitude)) {
    addDefaultPosition()
    return null
  }

  return (
    markers.map((marker, idx) => (
      <Marker
        key={marker._id}
        {...marker}
        draggable
        onDrag={e => onDrag(e, idx)}
      >
        <Pane>
          <Text
            position='absolute'
            top={-62}
            transform='translate(-50%)'
            borderRadius={20}
            backgroundColor='rgba(0, 0, 0, 0.7)'
            color='white'
            paddingX={8}
            paddingY={1}
            fontSize={10}
            whiteSpace='nowrap'
          >
            {marker.type}
          </Text>

          <MapMarkerIcon
            filter='drop-shadow(1px 2px 1px rgba(0, 0, 0, .3))'
            color={style === 'vector' ? 'info' : 'success'}
            transform='translate(-50%, -100%)'
            size={size}
          />
        </Pane>
      </Marker>
    ))
  )
}

EditableMarker.propTypes = {
  viewport: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired
  }).isRequired,
  size: PropTypes.number,
  style: PropTypes.string
}

EditableMarker.defaultProps = {
  size: 32,
  style: 'vector'
}

export default EditableMarker
