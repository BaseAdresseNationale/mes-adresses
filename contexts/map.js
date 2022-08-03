import React, {useEffect, useState, useMemo, useRef, useCallback} from 'react'

const MapContext = React.createContext()

const defaultViewport = {
  latitude: 46.5693,
  longitude: 1.1771,
  zoom: 6,
  transitionDuration: 0
}

const defaultStyle = 'vector'

export function MapContextProvider(props) {
  const mapRef = useRef()

  const [style, setStyle] = useState(defaultStyle)
  const [viewport, setViewport] = useState(defaultViewport)
  const [isCadastreDisplayed, setIsCadastreDisplayed] = useState(false)

  const handleMapRef = useCallback(ref => {
    if (ref) {
      mapRef.current = ref
    }
  }, [])

  useEffect(() => {
    if (!viewport) {
      setViewport(defaultViewport)
    }
  }, [viewport])

  const value = useMemo(() => ({
    mapRef,
    style, setStyle, defaultStyle,
    viewport, setViewport,
    isCadastreDisplayed, setIsCadastreDisplayed,
    handleMapRef
  }), [
    style,
    viewport,
    isCadastreDisplayed,
    handleMapRef
  ])

  return (
    <MapContext.Provider value={value} {...props} />
  )
}

export const MarkerContextConsumer = MapContext.Consumer

export default MapContext
