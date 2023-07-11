import React, {useCallback, useState, useMemo, useEffect, useContext} from 'react'
import BalContext from '@/contexts/bal-data'

const MapContext = React.createContext()

const defaultViewport = {
  latitude: 46.5693,
  longitude: 1.1771,
  zoom: 6,
  transitionDuration: 0
}

const defaultStyle = 'vector'

export const BAL_API_URL = process.env.NEXT_PUBLIC_BAL_API_URL || 'https://api-bal.adresse.data.gouv.fr/v1'

export const SOURCE_TILE_ID = 'tiles'

export function MapContextProvider(props) {
  const [map, setMap] = useState(null)
  const [style, setStyle] = useState(defaultStyle)
  const [viewport, setViewport] = useState(defaultViewport)
  const [isCadastreDisplayed, setIsCadastreDisplayed] = useState(false)
  const [isTileSourceLoaded, setIsTileSourceLoaded] = useState(false)
  const [isStyleLoaded, setIsStyleLoaded] = useState(false)

  const {baseLocale} = useContext(BalContext)

  useEffect(() => {
    map?.on('load', () => {
      const source = map.getSource(SOURCE_TILE_ID)
      if (source && source.loaded()) {
        setIsTileSourceLoaded(true)
      }
    })
  }, [map])

  const reloadTiles = useCallback(() => {
    if (map && isTileSourceLoaded) {
      const source = map.getSource(SOURCE_TILE_ID)
      // Remplace les tuiles avec de nouvelles tuiles
      const BAL_TILES_URL = BAL_API_URL + '/bases-locales/' + baseLocale._id + '/tiles/{z}/{x}/{y}.pbf'
      source.setTiles([BAL_TILES_URL])
    }
  }, [map, isTileSourceLoaded, baseLocale._id])

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
    isTileSourceLoaded, reloadTiles,
    style, setStyle, defaultStyle,
    isStyleLoaded,
    viewport, setViewport,
    isCadastreDisplayed, setIsCadastreDisplayed,
  }), [
    map,
    isTileSourceLoaded,
    reloadTiles,
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
