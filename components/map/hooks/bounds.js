import {useMemo, useContext, useState, useEffect, useRef} from 'react'
import bbox from '@turf/bbox'

import BalDataContext from '@/contexts/bal-data'
import {useRouter} from 'next/router'

function useBounds(commune, toponyme) {
  const {geojson, editingItem} = useContext(BalDataContext)
  const [data, setData] = useState(commune.contour)

  const router = useRouter()
  const geojsonFeatures = useRef(geojson?.features)

  useEffect(() => {
    geojsonFeatures.current = geojson?.features
  }, [geojson])

  useEffect(() => {
    let data
    const {idVoie, idToponyme} = router.query

    if (geojsonFeatures.current) {
      if (idVoie) {
        data = {
          type: 'FeatureCollection',
          features: geojsonFeatures.current.filter(feature => feature.properties.idVoie === router.query.idVoie)
        }
      } else if (idToponyme) {
        const numeroToponyme = geojsonFeatures.current.filter(feature => feature.properties.idToponyme === idToponyme)
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

    if (!geojsonFeatures.current || (!router.query.idVoie && !router.query.idToponyme)) {
      data = commune.contour
    }

    setData(data)
  }, [commune.contour, router.query, toponyme])

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

