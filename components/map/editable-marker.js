import React, {useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Pane, MapMarkerIcon, Text} from 'evergreen-ui'

import MarkersContext from '../../contexts/markers'

function EditableMarker({size, style}) {
  const {markers, updateMarker} = useContext(MarkersContext)

  const onDragEnd = useCallback((event, idx) => {
    const [longitude, latitude] = event.lngLat
    const {_id, type} = markers[idx]

    updateMarker(_id, {longitude, latitude, type})
  }, [markers, updateMarker])

  if (markers.length === 0) {
    return null
  }

  return (
    markers.map((marker, idx) => (
      <Marker
        key={marker._id}
        {...marker}
        draggable
        onDragEnd={e => onDragEnd(e, idx)}
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
  size: PropTypes.number,
  style: PropTypes.string
}

EditableMarker.defaultProps = {
  size: 32,
  style: 'vector'
}

export default EditableMarker
