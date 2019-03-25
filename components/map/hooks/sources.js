import {useMemo, useCallback} from 'react'
import {groupBy} from 'lodash-es'
import computeCentroid from '@turf/centroid'
import randomColor from 'randomcolor'

function useSources(geojson, voie) {
  const getColor = useCallback(idVoie => {
    if (voie && voie._id !== idVoie) {
      return '#cccccc'
    }

    return randomColor({
      luminosity: 'dark',
      seed: idVoie
    })
  }, [voie])

  const sources = useMemo(() => {
    const sources = []

    if (geojson && geojson.features.length > 0) {
      sources.push({
        name: 'positions',
        data: {
          type: 'FeatureCollection',
          features: geojson.features.map(feature => ({
            ...feature,
            properties: {
              ...feature.properties,
              color: getColor(feature.properties.idVoie)
            }
          }))
        }
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
  }, [geojson, getColor])

  return sources
}

export default useSources
