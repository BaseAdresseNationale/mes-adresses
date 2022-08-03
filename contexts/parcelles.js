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
  const {mapRef, isCadastreDisplayed} = useContext(MapContext)
  const {parcelles} = useContext(BalDataContext)

  const [isParcelleSelectionEnabled, setIsParcelleSelectionEnabled] = useState(false)
  const [selectedParcelles, setSelectedParcelles] = useState([])

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

  // Toggle all cadastre layers visiblity
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap()
      if (map.getSource('cadastre')) {
        cadastreLayers.forEach(layer => {
          map.setLayoutProperty(layer.id, 'visibility', isCadastreDisplayed ? 'visible' : 'none')
        })
      }
    }
  }, [mapRef, isCadastreDisplayed])

  // Toggle selected parcelle visibility
  useEffect(() => {
    if (mapRef?.current) {
      const map = mapRef.current.getMap()
      if (isCadastreDisplayed) {
        const filters = parcelles.length > 0 ?
          ['any', ...parcelles.map(id => ['==', ['get', 'id'], id])] :
          ['==', ['get', 'id'], '']

        map.setFilter('parcelles-selected', filters)
      }
    }
  }, [mapRef, parcelles, isCadastreDisplayed])

  // Clean hovered parcelle when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled && hoveredParcelle?.current && mapRef?.current) {
      const map = mapRef.current.getMap()
      const {featureId} = hoveredParcelle.current
      map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: featureId}, {hover: false})
      hoveredParcelle.current = null
    }
  }, [mapRef, isParcelleSelectionEnabled])

  // Reset isStyleLoaded when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled) {
      setSelectedParcelles([])
    }
  }, [isParcelleSelectionEnabled])

  // Updates highlighted parcelles when parcelles changes
  // or when selection is enabled/disabled
  useEffect(() => {
    if (isCadastreDisplayed && mapRef?.current) {
      const map = mapRef.current.getMap()
      const filters = isParcelleSelectionEnabled ?
        ['any', ...selectedParcelles.map(id => ['==', ['get', 'id'], id])] :
        ['==', ['get', 'id'], '']

      map.setFilter('parcelle-highlighted', filters)
    }
  }, [mapRef, selectedParcelles, isParcelleSelectionEnabled, isCadastreDisplayed])

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
