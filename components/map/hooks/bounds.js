import {useMemo, useContext, useCallback, useState, useEffect, useRef} from 'react'
import bbox from '@turf/bbox'

import BalDataContext from '@/contexts/bal-data'
import {useRouter} from 'next/router'

function positionsToFeatures(id, positions) {
  if (positions.length > 0) {
    return positions.map(({point, ...props}) => {
      return {
        type: 'Feature',
        geometry: point,
        properties: {id, ...props}
      }
    })
  }
}

function useBounds(commune, voie, toponyme) {
  const {geojson, editingItem} = useContext(BalDataContext)
  const [data, setData] = useState(commune.contour)
  const [isGeojsonLoaded, setIsGeojsonLoaded] = useState(Boolean(geojson))

  const geojsonFeatures = useRef(geojson?.features)

  const router = useRouter()

  useEffect(() => {
    setIsGeojsonLoaded(Boolean(geojson))
    geojsonFeatures.current = geojson?.features
  }, [geojson])

  const getVoieBounds = useCallback(voieId => {
    const features = geojsonFeatures.current.filter(feature => feature.properties.idVoie === voieId)

    if (features.length > 0) {
      return {
        type: 'FeatureCollection',
        features: geojsonFeatures.current.filter(feature => feature.properties.idVoie === voieId)
      }
    }

    return commune.contour // Fallback when voie has no position or numeros
  }, [commune])

  const getToponymeBounds = useCallback(toponymeId => {
    let features
    const numeroToponyme = geojsonFeatures.current.filter(feature => feature.properties.idToponyme === toponymeId)

    if (numeroToponyme.length > 0) {
      features = numeroToponyme
    } else if (toponyme.positions.length > 0) {
      features = positionsToFeatures(toponyme._id, toponyme.positions)
    }

    if (features?.length > 0) {
      return {
        type: 'FeatureCollection',
        features
      }
    }

    return commune.contour // Fallback when toponyme has no position or numeros
  }, [toponyme, commune])

  useEffect(() => { // Get bounds on page load
    let data
    const {idVoie, idToponyme} = router.query

    if (isGeojsonLoaded) {
      if (idVoie) {
        data = getVoieBounds(idVoie)
      } else if (idToponyme) {
        data = getToponymeBounds(idToponyme)
      }
    }

    if (!geojsonFeatures.current || (!idVoie && !idToponyme)) {
      data = commune.contour
    }

    setData(data)
  }, [commune.contour, router.query, isGeojsonLoaded, getVoieBounds, getToponymeBounds, toponyme, voie])

  useEffect(() => { // Get bound of the current edited item
    if (editingItem) {
      let data
      if (editingItem.positions) { // Numéro or toponyme’s positions
        if (editingItem.positions?.length > 1) {
          const features = positionsToFeatures(editingItem._id, editingItem.positions)

          data = {
            type: 'FeatureCollection',
            features
          }
        }
      } else if (editingItem.parcelle) { // Distinguishes toponyme and voie
        data = getToponymeBounds(editingItem._id)
      } else {
        data = getVoieBounds(editingItem._id)
      }

      setData(data)
    }
  }, [editingItem, getVoieBounds, getToponymeBounds])

  return useMemo(() => data ? bbox(data) : null, [data])
}

export default useBounds
