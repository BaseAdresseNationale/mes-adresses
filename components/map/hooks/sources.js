import {useMemo, useContext, useCallback, useEffect} from 'react'
import {groupBy, pick} from 'lodash'
import computeCentroid from '@turf/centroid'
import randomColor from 'randomcolor'

import MapContext from '@/contexts/map'
import BalDataContext from '@/contexts/bal-data'

function useSources(isStyleLoaded) {
  const {map} = useContext(MapContext)
  const {geojson, editingId} = useContext(BalDataContext)

  const setPaintProperties = useCallback(feature => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        color: randomColor({
          luminosity: 'dark',
          seed: feature.properties.idVoie
        })
      }
    }
  }, [])

  const features = useMemo(() => {
    if (geojson) {
      // Exclude toponymes
      const features = geojson.features.filter(feature => feature.properties.type !== 'toponyme')

      return features.map(feature => setPaintProperties(feature))
    }

    return []
  }, [geojson, setPaintProperties])

  const voieTraceData = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: features.filter(({properties}) => properties.type === 'voie-trace' && properties.idVoie !== editingId)
    }
  }, [features, editingId])

  const positionsData = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: features.length > 0 ?
        features.filter(({properties}) => properties.type !== 'voie-trace') :
        []
    }
  }, [features])

  const voiesData = useMemo(() => {
    let data = []

    if (features.length > 0) {
      const adresses = features.filter(feature => feature.properties.type === 'adresse')
      const groups = groupBy(adresses, feature => feature.properties.idVoie)

      data = Object.values(groups).map(features => {
        const [feature] = features

        const centroid = computeCentroid({
          type: 'FeatureCollection',
          features
        })

        centroid.properties = pick(feature.properties, ['idVoie', 'nomVoie', 'color'])

        return centroid
      })
    }

    return {
      type: 'FeatureCollection',
      features: data
    }
  }, [features])

  const reloadVoieTrace = useCallback(() => {
    if (isStyleLoaded) {
      const voieTraceSource = map.getSource('voie-trace')
      voieTraceSource.setData(voieTraceData)
    }
  }, [map, isStyleLoaded, voieTraceData])

  const reloadPositions = useCallback(() => {
    if (isStyleLoaded) {
      const positionsSource = map.getSource('positions')
      positionsSource.setData(positionsData)
    }
  }, [map, isStyleLoaded, positionsData])

  const reloadVoies = useCallback(() => {
    if (isStyleLoaded) {
      const voiesSource = map.getSource('voies')
      voiesSource.setData(voiesData)
    }
  }, [map, isStyleLoaded, voiesData])

  useEffect(() => {
    reloadVoieTrace()
  }, [reloadVoieTrace])

  useEffect(() => {
    reloadPositions()
  }, [reloadPositions])

  useEffect(() => {
    reloadVoies()
  }, [reloadVoies])

  return [voieTraceData, positionsData, voiesData]
}

export default useSources
