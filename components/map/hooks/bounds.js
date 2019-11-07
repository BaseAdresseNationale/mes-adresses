import {useState, useMemo, useContext} from 'react'
import bbox from '@turf/bbox'
import buffer from '@turf/buffer'

import BalDataContext from '../../../contexts/bal-data'

const BUFFER_RADIUS = 100

function useBounds(commune, voie) {
  const [currentVoie, setCurrentVoie] = useState(null)
  const {geojson} = useContext(BalDataContext)

  const data = useMemo(() => {
    if (geojson) {
      let data = geojson

      if (voie) {
        if (voie._id === currentVoie) {
          return false
        }

        setCurrentVoie(voie._id)
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
  }, [geojson, commune, voie, currentVoie])

  return useMemo(() => data ? bbox(data) : data, [data])
}

export default useBounds
