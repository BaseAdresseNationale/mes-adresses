import React, {useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, MapMarkerIcon, Text} from 'evergreen-ui'

import MarkersContext from '../../contexts/markers'
import BalDataContext from '../../contexts/bal-data'

function EditableMarker({viewport, size, style}) {
  const {enabled, markers, overrideText, setMarkers} = useContext(MarkersContext)
  const {editingItem} = useContext(BalDataContext)

  const onDrag = useCallback((event, idx) => {
    const [longitude, latitude] = event.lngLat
    setMarkers(prevMarkers => {
      const newMarkers = [...prevMarkers]
      newMarkers[idx] = {_id: newMarkers[idx]._id, longitude, latitude}
      return newMarkers
    })
  }, [setMarkers])

  useEffect(() => {
    if (enabled && markers.length === 0) {
      setMarkers([{
        latitude: viewport.latitude,
        longitude: viewport.longitude
      }])
    }
  }, [enabled, setMarkers, viewport, markers])

  if (!enabled || markers.length === 0) {
    return null
  }

  return (
    markers.map((marker, idx) => (
      <Marker
        key={marker._id}
        {...markers[idx]}
        draggable
        onDrag={e => onDrag(e, idx)}
      >
        <Pane>
          {((editingItem && editingItem.positions) || overrideText) && (
            <Text
              position='absolute'
              top={-58}
              transform='translate(-50%)'
              borderRadius={20}
              backgroundColor='rgba(0, 0, 0, 0.7)'
              color='white'
              paddingX={8}
              whiteSpace='nowrap'
            >
              {overrideText || editingItem.nom || editingItem.numeroComplet}
            </Text>
          )}

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
