import {useCallback, useEffect, useState, useContext} from 'react'

import ParcellesContext from '../../../contexts/parcelles'

function useHovered() {
  const {handleHoveredParcelle} = useContext(ParcellesContext)

  const [hovered, setHovered] = useState(null)

  const handleHover = useCallback(event => {
    const feature = event && event.features && event.features[0]

    if (feature && feature.source === 'cadastre') {
      handleHoveredParcelle({featureId: feature.id, id: feature.properties.id})
    } else {
      handleHoveredParcelle(null)
    }

    if (feature && feature.source !== 'cadastre') {
      setHovered(feature.properties.idVoie)
    }
  }, [handleHoveredParcelle])

  useEffect(() => {
    if (!hovered) {
      handleHoveredParcelle(null)
    }
  }, [hovered, handleHoveredParcelle])

  return [hovered, setHovered, handleHover]
}

export default useHovered

