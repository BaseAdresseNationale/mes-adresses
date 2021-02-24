import React, {useEffect, useState} from 'react'

const MapContext = React.createContext()

const defaultViewport = {
  latitude: 46.5693,
  longitude: 1.1771,
  zoom: 6,
  transitionDuration: 0
}

export function MapContextProvider(props) {
  const [viewport, setViewport] = useState(defaultViewport)

  useEffect(() => {
    if (!viewport) {
      setViewport(defaultViewport)
    }
  }, [viewport])

  return (
    <MapContext.Provider
      value={{viewport, setViewport}}
      {...props}
    />
  )
}

export const MarkerContextConsumer = MapContext.Consumer

export default MapContext
