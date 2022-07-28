import React, {useState, useContext, useEffect, useCallback, useMemo, useRef} from 'react'

import MapContext from '@/contexts/map'

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
  const {map, isCadastreDisplayed} = useContext(MapContext)

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
    if (map && hoveredParcelle) {
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
  }, [map, isCadastreDisplayed])

  const highlightParcelles = useCallback(parcelles => {
    if (map && isLayerLoaded && isCadastreDisplayed) {
      const filters = isParcelleSelectionEnabled ?
        ['any', ...parcelles.map(id => ['==', ['get', 'id'], id])] :
        ['==', ['get', 'id'], '']
      map.setFilter('parcelle-highlighted', filters)
    }
  }, [map, isLayerLoaded, isParcelleSelectionEnabled, isCadastreDisplayed])

  // Use state to know when parcelle-highlighted layer is loaded
  const handleLoad = useCallback(() => {
    const layer = map.getLayer('parcelle-highlighted')
    setIsLayerLoaded(Boolean(layer))
  }, [map, setIsLayerLoaded])

  // Clean hovered parcelle when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled && map && hoveredParcelle?.current) {
      const {featureId} = hoveredParcelle.current
      map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: featureId}, {hover: false})
      hoveredParcelle.current = null
    }
  }, [map, isParcelleSelectionEnabled])

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
  // to know if parcelle-highlighted layer is loaded or not
  useEffect(() => {
    if (map && !LOAD) {
      LOAD = true
      map.on('styledata', handleLoad)
      map.on('styledataloading', handleLoad)
    }

    return () => {
      if (map) {
        map.off('styledata', handleLoad)
        map.off('styledataloading', handleLoad)
      }
    }
  }, [map, handleLoad])

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
