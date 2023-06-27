import {useCallback, useContext, useRef, useState} from 'react'

import ParcellesContext from '@/contexts/parcelles'
import {LAYERS_SOURCE} from '@/components/map/layers/tiles'

function useHovered(map) {
  const hovered = useRef()
  const {handleHoveredParcelle} = useContext(ParcellesContext)
  const [featureHovered, setFeatureHovered] = useState(null)

  const handleRelatedNumerosPoints = (map, idVoie, isHovered) => {
    const numerosFeatures = map.querySourceFeatures('tiles', {
      sourceLayer: LAYERS_SOURCE.NUMEROS_POINTS,
      filter: ['==', ['get', 'idVoie'], idVoie]
    })
    numerosFeatures.forEach(({id}) => {
      map.setFeatureState({source: 'tiles', sourceLayer: LAYERS_SOURCE.NUMEROS_POINTS, id}, {hover: isHovered})
    })
    map.setFeatureState({source: 'tiles', sourceLayer: LAYERS_SOURCE.VOIES_LINES_STRINGS, id: idVoie}, {hover: isHovered})
  }

  const handleRelatedVoiePoints = (map, id, isHovered) => {
    map.setFeatureState({source: 'tiles', sourceLayer: LAYERS_SOURCE.VOIES_POINTS, id}, {hover: isHovered})
  }

  // Highlight related features
  const handleRelatedFeatures = (map, feature, isHovered) => {
    const {source, sourceLayer, properties} = feature
    if (source === 'tiles') {
      if (sourceLayer === LAYERS_SOURCE.VOIES_POINTS) {
        handleRelatedNumerosPoints(map, properties.id, isHovered)
      } else if (sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS || sourceLayer === LAYERS_SOURCE.VOIES_LINES_STRINGS) {
        handleRelatedVoiePoints(map, sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS ? properties.idVoie : properties.id, isHovered)
      }
    }
  }

  const handleHover = useCallback(event => {
    const feature = event && event.features && event.features[0]
    if (feature) {
      const {source, id, sourceLayer, properties} = feature

      if (source === 'cadastre') {
        handleHoveredParcelle({featureId: id, id: properties.id})
      }

      if (hovered.current) {
        map.setFeatureState({
          source: hovered.current.source,
          id: hovered.current.id,
          sourceLayer: hovered.current.sourceLayer
        }, {hover: false})
        handleRelatedFeatures(map, hovered.current, false)
        setFeatureHovered(null)
      }

      hovered.current = feature

      // Highlight hovered features
      map.setFeatureState({source, id, sourceLayer}, {hover: true})
      handleRelatedFeatures(map, feature, true)
      if (sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS || sourceLayer === LAYERS_SOURCE.VOIES_POINTS) {
        setFeatureHovered(feature)
      }
    }
  }, [map, handleHoveredParcelle])

  const handleMouseLeave = useCallback(() => {
    if (hovered.current) {
      const {id, source, sourceLayer} = hovered.current
      map.setFeatureState({source, sourceLayer, id}, {hover: false})
      handleRelatedFeatures(map, hovered.current, false)
      setFeatureHovered(null)

      if (source === 'cadastre') {
        handleHoveredParcelle(null)
      }
    }

    hovered.current = null
  }, [map, handleHoveredParcelle])

  return [handleHover, handleMouseLeave, featureHovered]
}

export default useHovered

