import {useMemo, useContext} from 'react'
import bbox from '@turf/bbox'
import buffer from '@turf/buffer'

import BalDataContext from '../../../contexts/bal-data'
import MarkerContext from '../../../contexts/marker'

const BUFFER_RADIUS = 100

function useBounds(commune, voie) {
  const {geojson} = useContext(BalDataContext)
  const {marker, enabled} = useContext(MarkerContext)

  const data = useMemo(() => {
    if (enabled && marker) {
      if (voie) {
        return false
      }

      return buffer({
        type: 'Point',
        coordinates: [marker.longitude, marker.latitude]
      }, BUFFER_RADIUS, {
        units: 'meters'
      })
    }

    if (geojson) {
      let data = geojson

      if (voie) {
        data = {
          type: 'FeatureCollection',
          features: data.features.filter(feature => feature.properties.idVoie === voie._id)
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

    // We’re depending on `enabled` and not `marker` here so that
    // we only re-center the map when the marker gets enabled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geojson, commune, voie, enabled])

  return useMemo(() => data ? bbox(data) : data, [data])
}

export default useBounds
