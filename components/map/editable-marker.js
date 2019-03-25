import React, {useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Icon} from 'evergreen-ui'

import MarkerContext from '../../contexts/marker'

function EditableMarker({viewport, size}) {
  const {enabled, marker, setMarker} = useContext(MarkerContext)

  const onDrag = useCallback(event => {
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    })
  }, [setMarker])

  useEffect(() => {
    if (enabled) {
      setMarker(marker => marker || {
        latitude: viewport.latitude,
        longitude: viewport.longitude
      })
    }
  }, [enabled, setMarker])

  if (!enabled || !marker) {
    return null
  }

  return (
    <Marker
      {...marker}
      draggable
      onDrag={onDrag}
    >
      <Icon
        icon='map-marker'
        filter='drop-shadow(1px 2px 1px rgba(0, 0, 0, .3))'
        color='info'
        transform='translate(-50%, -100%)'
        size={size}
      />
    </Marker>
  )
}

EditableMarker.propTypes = {
  size: PropTypes.number
}

EditableMarker.defaultProps = {
  size: 32
}

export default EditableMarker
