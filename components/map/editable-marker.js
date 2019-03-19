import React, {useCallback, useEffect, useContext} from 'react'
import {Marker} from 'react-map-gl'

import MarkerContext from '../../contexts/marker'

import Pin from './pin'

function EditableMarker({viewport}) {
  const {enabled, marker, setMarker} = useContext(MarkerContext)

  const onDrag = useCallback(event => {
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    })
  }, [setMarker])

  useEffect(() => {
    if (enabled) {
      setMarker({
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
      <Pin />
    </Marker>
  )
}

export default EditableMarker
