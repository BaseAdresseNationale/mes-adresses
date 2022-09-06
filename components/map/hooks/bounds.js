import {useMemo, useContext, useState, useEffect} from 'react'
import bbox from '@turf/bbox'
import buffer from '@turf/buffer'

import BalDataContext from '@/contexts/bal-data'

const BUFFER_RADIUS = 100

function useBounds(commune, voie, toponyme, editedNumero) {
  const {geojson} = useContext(BalDataContext)
  const [hasBound, setHasBound] = useState(false)

  useEffect(() => {
    setHasBound(Boolean(geojson))
  }, [geojson])

  const data = useMemo(() => {
    if (hasBound) {
      let data = null

      if (editedNumero?.positions.length > 1) {
        const features = editedNumero.positions.map((p, idx) => {
          return {
            type: 'Feature',
            geometry: editedNumero.positions[idx].point,
            properties: {id: editedNumero._id}
          }
        })

        data = {
          type: 'FeatureCollection',
          features
        }

        return data
      }

      if (voie) {
        data = {
          type: 'FeatureCollection',
          features: geojson.features.filter(feature => feature.properties.idVoie === voie._id)
        }
      }

      if (toponyme) {
        const numeroToponyme = geojson.features.filter(feature => feature.properties.idToponyme === toponyme._id)
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

      if (data && data.features.length > 0) {
        if (data.features.length === 1) {
          return buffer(data.features[0], BUFFER_RADIUS, {
            units: 'meters'
          })
        }

        return data
      }

      return commune.contour
    }

    return null
  }, [commune, voie, toponyme, hasBound, editedNumero]) // eslint-disable-line react-hooks/exhaustive-deps
  // Use hasBound as hook instead of geojson to prevent fitBounds on numero update

  return useMemo(() => data ? bbox(data) : data, [data])
}

export default useBounds

