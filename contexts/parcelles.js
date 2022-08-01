import React, {useState, useContext, useEffect, useCallback, useMemo, useRef} from 'react'

import {cadastreLayers} from '@/components/map/layers/cadastre'

import MapContext from '@/contexts/map'
import BalDataContext from './bal-data'

const ParcellesContext = React.createContext()

let LOAD = false

function getHoveredFeatureId(map, id) {
  const features = map.querySourceFeatures('cadastre', {
    sourceLayer: 'parcelles', filter: ['==', ['get', 'id'], id]
  })
  const [feature] = features
  return feature?.id
}

export function ParcellesContextProvider(props) {
  const {mapRef, isCadastreDisplayed} = useContext(MapContext)
  const {baseLocale, parcelles} = useContext(BalDataContext)

  const [isParcelleSelectionEnabled, setIsParcelleSelectionEnabled] = useState(false)
  const [selectedParcelles, setSelectedParcelles] = useState([])
  const [isLayerLoaded, setIsLayerLoaded] = useState(false)

  const hoveredParcelle = useRef()

  const handleParcelle = useCallback(parcelle => {
    if (isParcelleSelectionEnabled) {
      setSelectedParcelles(parcelles => {
        if (selectedParcelles.includes(parcelle)) {
          return selectedParcelles.filter(id => id !== parcelle)
        }

        return [...parcelles, parcelle]
      })
    }
  }, [selectedParcelles, isParcelleSelectionEnabled])

  const handleHoveredParcelle = useCallback(hovered => {
    if (mapRef?.current && hoveredParcelle) {
      const map = mapRef.current.getMap()

      if (hoveredParcelle.current && isCadastreDisplayed) {
        map.setFeatureState({
          source: 'cadastre',
          sourceLayer: 'parcelles',
          id: hoveredParcelle.current.featureId
        }, {hover: false})
      }

      if (hovered) {
        const featureId = hovered.featureId || getHoveredFeatureId(map, hovered.id)

        if (featureId && isCadastreDisplayed) {
          map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: featureId}, {hover: true})
        }

        hoveredParcelle.current = {id: hovered.id, featureId}
      } else {
        hoveredParcelle.current = null
      }
    }
  }, [mapRef, isCadastreDisplayed])

  const highlightParcelles = useCallback(parcelles => {
    if (mapRef?.current && isLayerLoaded && isCadastreDisplayed) {
      const map = mapRef.current.getMap()
      const filters = isParcelleSelectionEnabled ?
        ['any', ...parcelles.map(id => ['==', ['get', 'id'], id])] :
        ['==', ['get', 'id'], '']

      map.setFilter('parcelle-highlighted', filters)
    }
  }, [mapRef, isLayerLoaded, isParcelleSelectionEnabled, isCadastreDisplayed])

  // Use state to know when parcelle-highlighted layer is loaded
  const handleLoad = useCallback(() => {
    const map = mapRef.current.getMap()
    const parcelleHightlightedLayer = map.getLayer('parcelle-highlighted')
    const parcellesSeletedLayer = map.getLayer('parcelles-selected')

    setIsLayerLoaded(parcelleHightlightedLayer && parcellesSeletedLayer)
  }, [mapRef, setIsLayerLoaded])

  // Filter cadastre with code commune
  useEffect(() => {
    if (mapRef?.current) {
      const map = mapRef.current.getMap()
      map.setFilter('parcelles', ['match', ['get', 'commune'], baseLocale.codeCommune, true, false])
      map.setFilter('parcelles-fill', ['match', ['get', 'commune'], baseLocale.codeCommune, true, false])
    }
  }, [mapRef, baseLocale.codeCommune])

  // Toggle all cadastre layers visiblity
  useEffect(() => {
    if (mapRef?.current) {
      const map = mapRef.current.getMap()

      cadastreLayers.forEach(layer => {
        map.setLayoutProperty(layer.id, 'visibility', isCadastreDisplayed ? 'visible' : 'none')
      })
    }
  }, [mapRef, isCadastreDisplayed])

  // Toggle selected parcelle visibility
  useEffect(() => {
    if (mapRef?.current && isLayerLoaded && isCadastreDisplayed) {
      const map = mapRef.current.getMap()
      const filters = parcelles.length > 0 ?
        ['any', ...parcelles.map(id => ['==', ['get', 'id'], id])] :
        ['==', ['get', 'id'], '']

      map.setFilter('parcelles-selected', filters)
    }
  }, [mapRef, parcelles, isLayerLoaded, isCadastreDisplayed])

  // Clean hovered parcelle when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled && mapRef?.current && hoveredParcelle?.current) {
      const {featureId} = hoveredParcelle.current
      const map = mapRef.current.getMap()
      map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: featureId}, {hover: false})
      hoveredParcelle.current = null
    }
  }, [mapRef, isParcelleSelectionEnabled])

  // Reset IsLayerLoaded when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled) {
      setSelectedParcelles([])
      setIsLayerLoaded(false)
    }
  }, [isParcelleSelectionEnabled])

  // Updates highlighted parcelles when parcelles changes
  // or when selection is enabled/disabled
  useEffect(() => {
    highlightParcelles(selectedParcelles)
  }, [isParcelleSelectionEnabled, isLayerLoaded, selectedParcelles, highlightParcelles])

  // Look styledata event
  // to know if parcelle-highlighted & parcelles-selected layers are loaded or not
  useEffect(() => {
    if (mapRef?.current && !LOAD) {
      LOAD = true
      const map = mapRef.current.getMap()
      map.on('styledata', handleLoad)
      map.on('styledataloading', handleLoad)
    }

    return () => {
      if (mapRef?.current) {
        const map = mapRef.current.getMap()
        map.off('styledata', handleLoad)
        map.off('styledataloading', handleLoad)
      }
    }
  }, [mapRef, handleLoad])

  const value = useMemo(() => ({
    selectedParcelles, setSelectedParcelles,
    isParcelleSelectionEnabled, setIsParcelleSelectionEnabled,
    handleParcelle,
    hoveredParcelle, handleHoveredParcelle
  }), [
    selectedParcelles,
    isParcelleSelectionEnabled,
    handleParcelle,
    hoveredParcelle,
    handleHoveredParcelle
  ])

  return (
    <ParcellesContext.Provider value={value} {...props} />
  )
}

export default ParcellesContext
