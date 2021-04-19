import {useMemo, useContext} from 'react'
import bbox from '@turf/bbox'
import buffer from '@turf/buffer'

import BalDataContext from '../../../contexts/bal-data'

const BUFFER_RADIUS = 100

function useBounds(commune, voie, toponyme) {
  const {geojson} = useContext(BalDataContext)

  const data = useMemo(() => {
    if (geojson) {
      let data = geojson

      if (voie) {
        data = {
          type: 'FeatureCollection',
          features: data.features.filter(feature => feature.properties.idVoie === voie._id)
        }
      }

      if (toponyme) {
        const numeroToponyme = data.features.filter(feature => feature.properties.idToponyme === toponyme._id)
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

      if (data.features.length === 1) {
        return buffer(data.features[0], BUFFER_RADIUS, {
          units: 'meters'
        })
      }

      if (data.features.length > 0) {
        return data
      }
    }

    if (commune) {
      return commune.contour
    }

    return null
  }, [commune, voie, toponyme]) // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(() => data ? bbox(data) : data, [data])
}

export default useBounds
