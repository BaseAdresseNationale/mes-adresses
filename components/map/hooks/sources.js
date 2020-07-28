import {useMemo, useContext} from 'react'
import {groupBy} from 'lodash'
import computeCentroid from '@turf/centroid'
import randomColor from 'randomcolor'

import BalDataContext from '../../../contexts/bal-data'

function useSources(voie, hovered) {
  const {geojson} = useContext(BalDataContext)

  return useMemo(() => {
    const sources = []
    const setPaintProperties = features => {
      return features.map(feature => ({
        ...feature,
        id: feature.properties.idNumero || feature.properties.idVoie,
        properties: {
          ...feature.properties,
          opacity: feature.properties.idVoie === hovered ? 1 : 0.4,
          color: randomColor({
            luminosity: 'dark',
            seed: feature.properties.idVoie
          })
        }
      }))
    }

    if (!geojson) {
      return sources
    }

    // Exclude toponymes
    let features = geojson.features.filter(feature => feature.properties.type !== 'toponyme')

    if (voie) {
      // Filter current voie’s numeros out
      features = features.filter(feature => feature.properties.idVoie !== voie._id)
    }

    features = setPaintProperties(features)

    if (features.length > 0) {
      sources.push({
        name: 'positions',
        data: {
          type: 'FeatureCollection',
          features
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
  }, [geojson, voie, hovered])
}

export default useSources
