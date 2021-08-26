import React, {useEffect, useState} from 'react'

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
  const [showCadastre, setShowCadastre] = useState(false)

  useEffect(() => {
    if (!viewport) {
      setViewport(defaultViewport)
    }
  }, [viewport])

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        style,
        setStyle,
        defaultStyle,
        viewport,
        setViewport,
        showCadastre,
        setShowCadastre
      }}
      {...props}
    />
  )
}

export const MarkerContextConsumer = MapContext.Consumer

export default MapContext
