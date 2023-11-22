import React, {useCallback, useState, useMemo, useEffect, useContext} from 'react'
import BalContext from '@/contexts/bal-data'
import LocalStorageContext from '@/contexts/local-storage'
import type {MapRef, ViewState} from 'react-map-gl/maplibre'
import {ChildrenProps} from '@/types/context'

interface MapContextType {
  map: MapRef | null;
  setMap: (value: MapRef | null) => void;
  handleMapRef: (ref: any) => void;
  isTileSourceLoaded: boolean;
  reloadTiles: () => void;
  style: string;
  setStyle: (value: string) => void;
  defaultStyle: string;
  isStyleLoaded: boolean;
  viewport: Partial<ViewState>;
  setViewport: (value: Partial<ViewState>) => void;
  isCadastreDisplayed: boolean;
  setIsCadastreDisplayed: (value: boolean) => void;
  balTilesUrl: string;
  isMapLoaded: boolean;
}

const MapContext = React.createContext<MapContextType | null>(null)

const defaultViewport: Partial<ViewState> = {
  latitude: 46.5693,
  longitude: 1.1771,
  zoom: 6
}

const defaultStyle = 'vector'

export const BAL_API_URL = process.env.NEXT_PUBLIC_BAL_API_URL || 'https://api-bal.adresse.data.gouv.fr/v1'

export const SOURCE_TILE_ID = 'tiles'

export function MapContextProvider(props: ChildrenProps) {
  const [map, setMap] = useState<MapRef | null>(null)
  const [style, setStyle] = useState<string>(defaultStyle)
  const [viewport, setViewport] = useState<Partial<ViewState>>(defaultViewport)
  const [isCadastreDisplayed, setIsCadastreDisplayed] = useState<boolean>(false)
  const [isTileSourceLoaded, setIsTileSourceLoaded] = useState<boolean>(false)
  const [isStyleLoaded, setIsStyleLoaded] = useState<boolean>(false)
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false)

  const {baseLocale} = useContext(BalContext)
  const {userSettings} = useContext(LocalStorageContext)

  const balTilesUrl = `${BAL_API_URL}/bases-locales/${baseLocale._id}/tiles/{z}/{x}/{y}.pbf${userSettings?.colorblindMode ? '?colorblindMode=true' : ''}`

  useEffect(() => {
    map?.on('load', () => {
      const source = map.getSource(SOURCE_TILE_ID)
      if (source?.loaded()) {
        setIsTileSourceLoaded(true)
      }
    })
  }, [map])

  // When the map is fully loaded (with the layers), this event is triggered
  map?.on('idle', () => {
    setIsMapLoaded(true)
  })

  const reloadTiles = useCallback(() => {
    if (map && isTileSourceLoaded) {
      // Fix BUG VectorTileSource
      const source: any = map.getSource(SOURCE_TILE_ID)
      // Remplace les tuiles avec de nouvelles tuiles
      source.setTiles([balTilesUrl])
    }
  }, [map, isTileSourceLoaded, balTilesUrl])

  const handleMapRef = useCallback(ref => {
    if (ref) {
      const map: MapRef = ref.getMap()
      setMap(map)
      map.on('styledataloading', () => {
        setIsStyleLoaded(false)
        void map.once('style.load', () => {
          setIsStyleLoaded(true)
        })
      })
    }
  }, [])

  const value = useMemo(() => ({
    map, setMap, handleMapRef,
    isTileSourceLoaded, reloadTiles,
    style, setStyle, defaultStyle,
    isStyleLoaded,
    viewport, setViewport,
    isCadastreDisplayed, setIsCadastreDisplayed,
    balTilesUrl,
    isMapLoaded
  }), [
    map,
    isTileSourceLoaded,
    reloadTiles,
    handleMapRef,
    isStyleLoaded,
    style,
    viewport,
    isCadastreDisplayed,
    balTilesUrl,
    isMapLoaded
  ])

  return (
    <MapContext.Provider value={value} {...props} />
  )
}

export const MarkerContextConsumer = MapContext.Consumer

export default MapContext
