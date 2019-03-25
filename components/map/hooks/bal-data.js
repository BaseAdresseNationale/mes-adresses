import {useMemo} from 'react'
import {groupBy} from 'lodash-es'
import computeCentroid from '@turf/centroid'

function useBalData(geojson) {
  const sources = useMemo(() => {
    const sources = []

    if (geojson && geojson.features.length > 0) {
      sources.push({
        name: 'positions',
        data: geojson
      })

      const adresses = geojson.features.filter(feature => feature.properties.type === 'adresse')
      const groups = groupBy(adresses, feature => feature.properties.idVoie)

      const voies = Object.values(groups).map(features => {
        const [feature] = features

        const centroid = computeCentroid({
          type: 'FeatureCollection',
          features
        })

        centroid.properties = feature.properties

        return centroid
      })

      sources.push({
        name: 'voies',
        data: {
          type: 'FeatureCollection',
          features: voies
        }
      })
    }

    return sources
  }, [geojson])

  return sources
}

export default useBalData
