import {useMemo, useContext, useState, useEffect} from 'react'
import bbox from '@turf/bbox'

import BalDataContext from '@/contexts/bal-data'
import {useRouter} from 'next/router'

function useBounds(commune, toponyme) {
  const {geojson, editingItem} = useContext(BalDataContext)
  const [data, setData] = useState(commune.contour)
  const [isGeojsonLoaded, setIsGeojsonLoaded] = useState(Boolean(geojson))

  const router = useRouter()

  useEffect(() => {
    setIsGeojsonLoaded(Boolean(geojson))
  }, [geojson])

  useEffect(() => {
    let data
    const {idVoie, idToponyme} = router.query

    if (isGeojsonLoaded) {
      if (idVoie) {
        data = {
          type: 'FeatureCollection',
          features: geojson.features.filter(feature => feature.properties.idVoie === router.query.idVoie)
        }
      } else if (idToponyme) {
        const numeroToponyme = geojson.features.filter(feature => feature.properties.idToponyme === idToponyme)
        data = {
          type: 'FeatureCollection',
          features: numeroToponyme.length === 0 && toponyme.positions.length === 1 ?
            [{
              type: 'Feature',
              geometry: toponyme.positions[0].point,
              properties: {id: toponyme._id}
            }] :
            numeroToponyme
        }
      }
    }

    if (!geojson || (!router.query.idVoie && !router.query.idToponyme)) {
      data = commune.contour
    }

    setData(data)
  }, [commune.contour, router.query, isGeojsonLoaded, toponyme]) // eslint-disable-line react-hooks/exhaustive-deps
  // Use hasBound as hook instead of geojson to prevent fitBounds on numero update

  useEffect(() => {
    if (editingItem?.positions?.length > 1) {
      const features = editingItem.positions.map(({point, ...props}) => {
        return {
          type: 'Feature',
          geometry: point,
          properties: {id: editingItem._id, ...props}
        }
      })

      setData({
        type: 'FeatureCollection',
        features
      })
    }
  }, [editingItem, setData])

  return useMemo(() => data ? bbox(data) : null, [data])
}

export default useBounds

