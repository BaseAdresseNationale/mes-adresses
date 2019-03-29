import {useMemo, useContext} from 'react'
import {groupBy} from 'lodash-es'
import computeCentroid from '@turf/centroid'
import randomColor from 'randomcolor'

import BalDataContext from '../../../contexts/bal-data'

function useSources(voie) {
  const {geojson} = useContext(BalDataContext)

  return useMemo(() => {
    const sources = []

    if (!geojson) {
      return sources
    }

    let {features} = geojson

    if (voie) {
      features = features.filter(feature => feature.properties.idVoie !== voie._id)
    }

    if (features.length > 0) {
      sources.push({
        name: 'positions',
        data: {
          type: 'FeatureCollection',
          features: features.map(feature => ({
            ...feature,
            properties: {
              ...feature.properties,
              color: voie ? '#cccccc' : randomColor({
                luminosity: 'dark',
                seed: feature.properties.idVoie
              })
            }
          }))
        }
      })

      const adresses = features.filter(feature => feature.properties.type === 'adresse')
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
  }, [geojson, voie])
}

export default useSources
