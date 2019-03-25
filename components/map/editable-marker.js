import React, {useMemo, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {Marker} from 'react-map-gl'
import {Icon} from 'evergreen-ui'
import randomColor from 'randomcolor'

import MarkerContext from '../../contexts/marker'

function EditableMarker({viewport, size, voie}) {
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

  const color = useMemo(() => {
    if (voie) {
      return randomColor({
        luminosity: 'dark',
        seed: voie._id
      })
    }

    return 'info'
  }, [voie])

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
        color={color}
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
