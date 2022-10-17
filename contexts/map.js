import React, {useCallback, useState, useMemo} from 'react'

const MapContext = React.createContext()

const defaultViewport = {
  latitude: 46.5693,
  longitude: 1.1771,
  zoom: 6,
  transitionDuration: 0
}

const defaultStyle = 'vector'

export function MapContextProvider(props) {
  const [map, setMap] = useState(null)
  const [style, setStyle] = useState(defaultStyle)
  const [viewport, setViewport] = useState(defaultViewport)
  const [isCadastreDisplayed, setIsCadastreDisplayed] = useState(false)

  const [isStyleLoaded, setIsStyleLoaded] = useState(false)

  const handleMapRef = useCallback(ref => {
    if (ref) {
      const map = ref.getMap()
      setMap(map)
      map.on('style.load', () => setIsStyleLoaded(true))
      map.on('styledataloading', () => setIsStyleLoaded(false))
    }
  }, [])

  const value = useMemo(() => ({
    map, setMap, handleMapRef,
    style, setStyle, defaultStyle,
    isStyleLoaded,
    viewport, setViewport,
    isCadastreDisplayed, setIsCadastreDisplayed,
  }), [
    map,
    handleMapRef,
    isStyleLoaded,
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
