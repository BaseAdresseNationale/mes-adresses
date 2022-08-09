import React, {useState, useContext, useEffect, useCallback, useMemo, useRef} from 'react'

import {cadastreLayers} from '@/components/map/layers/cadastre'

import MapContext from '@/contexts/map'
import BalDataContext from './bal-data'

const ParcellesContext = React.createContext()

function getHoveredFeatureId(map, id) {
  const [feature] = map.querySourceFeatures('cadastre', {
    sourceLayer: 'parcelles', filter: ['==', ['get', 'id'], id]
  })

  return feature?.id
}

export function ParcellesContextProvider(props) {
  const {map, isCadastreDisplayed, isStyleLoaded} = useContext(MapContext)
  const {baseLocale, parcelles} = useContext(BalDataContext)

  const [hoveredParcelle, setHoveredParcelle] = useState(null)
  const [isParcelleSelectionEnabled, setIsParcelleSelectionEnabled] = useState(false)
  const [selectedParcelles, setSelectedParcelles] = useState([])

  const prevHoveredParcelle = useRef()

  const handleHoveredParcelle = useCallback(hovered => {
    if (map && hovered) {
      const featureId = hovered.featureId || getHoveredFeatureId(map, hovered.id)

      if (!hovered.featureId && isCadastreDisplayed) { // Handle parcelle from side menu
        map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: featureId}, {hover: true})
        prevHoveredParcelle.current = featureId
      }

      setHoveredParcelle({id: hovered.id, featureId})
    } else {
      if (prevHoveredParcelle?.current && isCadastreDisplayed) {
        map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: prevHoveredParcelle.current}, {hover: false})
        prevHoveredParcelle.current = null
      }

      setHoveredParcelle(null)
    }
  }, [map, isCadastreDisplayed])

  const handleParcelle = useCallback(parcelle => {
    if (isParcelleSelectionEnabled) {
      setSelectedParcelles(parcelles => {
        if (selectedParcelles.includes(parcelle)) {
          return selectedParcelles.filter(id => id !== parcelle)
        }

        return [...parcelles, parcelle]
      })
      handleHoveredParcelle(null)
    }
  }, [selectedParcelles, isParcelleSelectionEnabled, handleHoveredParcelle])

  const toggleCadastreVisibility = useCallback(() => {
    cadastreLayers.forEach(layer => {
      map.setLayoutProperty(layer.id, 'visibility', isCadastreDisplayed ? 'visible' : 'none')
    })
  }, [map, isCadastreDisplayed])

  const filterSelectedParcelles = useCallback(() => {
    const filter = parcelles.length > 0 ?
      ['any', ...parcelles.map(id => ['==', ['get', 'id'], id])] :
      ['==', ['get', 'id'], '']

    map.setFilter('parcelles-selected', filter)
  }, [map, parcelles])

  const filterHighlightedParcelles = useCallback(() => {
    const filter = isParcelleSelectionEnabled ?
      ['any', ...selectedParcelles.map(id => ['==', ['get', 'id'], id])] :
      ['==', ['get', 'id'], '']

    map.setFilter('parcelle-highlighted', filter)
  }, [map, isParcelleSelectionEnabled, selectedParcelles])

  const reloadParcellesLayers = useCallback(() => {
    // Toggle all cadastre layers visiblity
    // Filter cadastre with code commune
    map.setFilter('parcelles', ['match', ['get', 'commune'], baseLocale.commune, true, false])
    map.setFilter('parcelles-fill', ['match', ['get', 'commune'], baseLocale.commune, true, false])

    toggleCadastreVisibility()

    // Toggle selected parcelle visibility
    if (isCadastreDisplayed) {
      filterSelectedParcelles()
      filterHighlightedParcelles()
    }
  }, [map, baseLocale.commune, toggleCadastreVisibility, filterSelectedParcelles, filterHighlightedParcelles, isCadastreDisplayed])

  // Toggle all cadastre layers visiblity
  useEffect(() => {
    if (map && map.getSource('cadastre') && isStyleLoaded) {
      toggleCadastreVisibility()
    }
  }, [map, isStyleLoaded, toggleCadastreVisibility])

  // Updates highlighted parcelles when parcelles changes
  // or when selection is enabled/disabled
  useEffect(() => {
    if (map && isCadastreDisplayed && isStyleLoaded) {
      filterSelectedParcelles()
      filterHighlightedParcelles()
    }
  }, [map, isCadastreDisplayed, isStyleLoaded, filterHighlightedParcelles, filterSelectedParcelles])

  // Reset isStyleLoaded when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled) {
      setSelectedParcelles([])
    }
  }, [isParcelleSelectionEnabled])

  useEffect(() => {
    if (isStyleLoaded) {
      reloadParcellesLayers()
    }
  }, [isStyleLoaded, reloadParcellesLayers])

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
