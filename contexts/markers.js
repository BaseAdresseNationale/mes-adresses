import React, {useState, useCallback, useContext, useMemo} from 'react'
import {uniqueId} from 'lodash'

import MapContext from '@/contexts/map'

const MarkersContext = React.createContext()

export function MarkersContextProvider(props) {
  const [markers, setMarkers] = useState([])
  const [overrideText, setOverrideText] = useState(null)
  const [suggestedNumero, setSuggestedNumero] = useState(null)

  const {viewport} = useContext(MapContext)

  const disableMarkers = useCallback(() => {
    setMarkers([])
    setOverrideText(null)
    setSuggestedNumero(null)
  }, [])

  const addMarker = useCallback(data => {
    let marker = {...data}
    setMarkers(prevMarkers => {
      if (!marker.latitude || !marker.longitude) {
        const {latitude, longitude} = viewport
        marker = {...marker, longitude, latitude}
      }

      return [...prevMarkers, {_id: uniqueId(), ...marker}]
    })
  }, [viewport])

  const removeMarker = useCallback(markerId => {
    setMarkers(prevMarkers => {
      const filtre = prevMarkers.filter(marker => marker._id !== markerId)
      return filtre
    })
  }, [])

  const updateMarker = useCallback((markerId, data) => {
    setMarkers(markers => {
      return markers.map(marker => {
        if (marker._id === markerId) {
          return {_id: markerId, ...data}
        }

        return marker
      })
    })
  }, [])

  const value = useMemo(() => ({
    markers,
    overrideText,
    setMarkers,
    addMarker,
    removeMarker,
    updateMarker,
    setOverrideText,
    disableMarkers,
    suggestedNumero,
    setSuggestedNumero
  }), [
    markers,
    overrideText,
    addMarker,
    removeMarker,
    updateMarker,
    disableMarkers,
    suggestedNumero,
  ])

  return (
    <MarkersContext.Provider value={value} {...props} />
  )
}

export const MarkerContextConsumer = MarkersContext.Consumer

export default MarkersContext
