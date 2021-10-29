import {useMemo, useContext} from 'react'
import {groupBy} from 'lodash'
import computeCentroid from '@turf/centroid'
import randomColor from 'randomcolor'

import BalDataContext from '../../../contexts/bal-data'

function useSources(voie, toponyme, hovered, editingId) {
  const {geojson} = useContext(BalDataContext)

  return useMemo(() => {
    const sources = []
    const setPaintProperties = feature => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          id: feature.properties.idNumero || feature.properties.idVoie,
          opacity: feature.properties.idVoie === hovered ? 1 : 0.4,
          color: randomColor({
            luminosity: 'dark',
            seed: feature.properties.idVoie
          })
        }
      }
    }

    if (!geojson) {
      return sources
    }

    // Exclude toponymes
    let features = geojson.features.filter(feature => feature.properties.type !== 'toponyme')

    if (voie) {
      // Exlude current voie’s numeros, replace by <NumeroMarker />
      features = features.filter(({properties}) => (properties.idVoie !== voie._id) || (properties.idVoie === voie._id && properties.type === 'voie-trace'))
    }

    if (toponyme) {
      // Exclude current toponyme’s numeros, replace by <NumeroMarker /
      features = features.filter(({properties}) => properties.idToponyme !== toponyme._id)
    }

    features = features.map(feature => setPaintProperties(feature))

    const lines = features.filter(({properties}) => properties.type === 'voie-trace' && properties.idVoie !== editingId)

    sources.push({
      name: 'voie-trace',
      data: {
        type: 'FeatureCollection',
        features: lines
      }
    })

    if (features.length > 0) {
      sources.push({
        name: 'positions',
        data: {
          type: 'FeatureCollection',
          features: features.filter(({properties}) => properties.type !== 'voie-trace')
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
  }, [geojson, voie, hovered, editingId])
}

export default useSources
