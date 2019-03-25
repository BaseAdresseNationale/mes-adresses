import {useMemo, useContext} from 'react'
import bbox from '@turf/bbox'
import buffer from '@turf/buffer'
import {point} from '@turf/helpers'

import MarkerContext from '../../../contexts/marker'

function useBounds(geojson, commune, voie) {
  const {marker, enabled} = useContext(MarkerContext)

  const data = useMemo(() => {
    if (enabled && marker) {
      return buffer(point([marker.longitude, marker.latitude]), 100, {
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
        return buffer(data.features[0], 100, {
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

  return useMemo(() => data ? bbox(data) : null, [data])
}

export default useBounds
