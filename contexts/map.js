import React, {useEffect, useState, useMemo} from 'react'

const MapContext = React.createContext()

const defaultViewport = {
  latitude: 46.5693,
  longitude: 1.1771,
  zoom: 6,
  transitionDuration: 0
}

const defaultStyle = 'vector'

export function MapContextProvider(props) {
  const [map, setMap] = useState()
  const [style, setStyle] = useState(defaultStyle)
  const [viewport, setViewport] = useState(defaultViewport)
  const [isCadastreDisplayed, setIsCadastreDisplayed] = useState(false)

  useEffect(() => {
    if (!viewport) {
      setViewport(defaultViewport)
    }
  }, [viewport])

  const value = useMemo(() => ({
    map, setMap,
    style, setStyle, defaultStyle,
    viewport, setViewport,
    isCadastreDisplayed, setIsCadastreDisplayed
  }), [
    map,
    style,
    viewport,
    isCadastreDisplayed
  ])

  return (
    <MapContext.Provider value={value} {...props} />
  )
}

export const MarkerContextConsumer = MapContext.Consumer

export default MapContext
