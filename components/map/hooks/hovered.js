import {useCallback, useRef} from 'react'

function useHovered(map) {
  const hovered = useRef()

  // Highlight related features
  const handleRelatedFeatures = (map, feature, isHovered) => {
    const {source, properties} = feature

    if (source === 'voies') {
      const voiePositions = map.querySourceFeatures('positions', {
        sourceLayer: 'numeros-point',
        filter: ['==', ['get', 'idVoie'], properties.idVoie]
      })

      voiePositions.forEach(({id}) => {
        map.setFeatureState({source: 'positions', id}, {hover: isHovered})
      })
    } else if (source === 'positions') {
      const [voie] = map.querySourceFeatures('voies', {
        sourceLayer: 'voie-label',
        filter: ['==', ['get', 'idVoie'], properties.idVoie]
      })

      if (voie) {
        map.setFeatureState({source: 'voies', id: voie.id}, {hover: isHovered})
      }
    }
  }

  const handleHover = useCallback(event => {
    const feature = event && event.features && event.features[0]

    if (feature) {
      const {source, id, sourceLayer} = feature

      if (hovered.current) {
        map.setFeatureState({
          source: hovered.current.source,
          id: hovered.current.id,
          sourceLayer: hovered.current.sourceLayer
        }, {hover: false})
        handleRelatedFeatures(map, hovered.current, false)
      }

      hovered.current = feature

      // Highlight hovered features
      map.setFeatureState({source, id, sourceLayer}, {hover: true})
      handleRelatedFeatures(map, feature, true)
    }
  }, [map])

  const handleMouseLeave = useCallback(() => {
    if (hovered.current) {
      const {id, source, sourceLayer} = hovered.current
      map.setFeatureState({source, sourceLayer, id}, {hover: false})
      handleRelatedFeatures(map, hovered.current, false)
    }

    hovered.current = null
  }, [map])

  return [handleHover, handleMouseLeave]
}

export default useHovered

