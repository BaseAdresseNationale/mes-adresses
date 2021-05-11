import {useEffect, useState} from 'react'

let PARCELLE

function useHovered(map) {
  const [hovered, setHovered] = useState(null)

  const handleHover = event => {
    const feature = event && event.features && event.features[0]

    if (PARCELLE) {
      map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: PARCELLE}, {hover: false})
      PARCELLE = null
    }

    if (feature && feature.source === 'cadastre') {
      PARCELLE = feature.id
      map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: PARCELLE}, {hover: true})
    }

    if (feature && feature.source !== 'cadastre') {
      setHovered(feature.properties.idVoie)
    }
  }

  useEffect(() => {
    if (!hovered) {
      PARCELLE = null
    }
  }, [hovered])

  return [hovered, setHovered, handleHover]
}

export default useHovered

