import {useCallback, useContext, useRef, useState} from 'react'
import ParcellesContext from '@/contexts/parcelles'

function useHovered(map) {
  const hovered = useRef()
  const {handleHoveredParcelle} = useContext(ParcellesContext)
  const [featureHovered, setFeatureHovered] = useState(null)

  // Highlight related features
  const handleRelatedFeatures = (map, feature, isHovered) => {
    const {source, sourceLayer, properties} = feature
    if (source === 'tiles') {
      if (sourceLayer === 'voies') {
        const numerosFeatures = map.querySourceFeatures('tiles', {
          sourceLayer: 'numeros',
          filter: ['==', ['get', 'idVoie'], properties.idVoie]
        })
        numerosFeatures.forEach(({id}) => {
          map.setFeatureState({source: 'tiles', sourceLayer: 'numeros', id}, {hover: isHovered})
        })
      } else if (sourceLayer === 'numeros') {
        const [voieFetaure] = map.querySourceFeatures('tiles', {
          sourceLayer: 'voies',
          filter: ['==', ['get', 'idVoie'], properties.idVoie]
        })
        if (voieFetaure) {
          map.setFeatureState({source: 'tiles', sourceLayer: 'voies', id: voieFetaure.id}, {hover: isHovered})
        }
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
        setFeatureHovered(null)
        handleRelatedFeatures(map, hovered.current, false)
      }

      hovered.current = feature

      // Highlight hovered features
      map.setFeatureState({source, id, sourceLayer}, {hover: true})
      handleRelatedFeatures(map, feature, true)
      if (source === 'tiles') {
        setFeatureHovered(feature)
      }
    }
  }, [map, handleHoveredParcelle])

  const handleMouseLeave = useCallback(() => {
    if (hovered.current) {
      const {id, source, sourceLayer} = hovered.current
      setFeatureHovered(null)
      map.setFeatureState({source, sourceLayer, id}, {hover: false})
      handleRelatedFeatures(map, hovered.current, false)

      if (source === 'cadastre') {
        handleHoveredParcelle(null)
      }
    }

    hovered.current = null
  }, [map, handleHoveredParcelle])

  return [handleHover, handleMouseLeave, featureHovered]
}

export default useHovered

