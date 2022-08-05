import {useMemo, useContext, useCallback, useEffect, useRef} from 'react'
import {groupBy, pick} from 'lodash'
import computeCentroid from '@turf/centroid'
import randomColor from 'randomcolor'

import MapContext from '@/contexts/map'
import BalDataContext from '@/contexts/bal-data'

function useSources() {
  const {map} = useContext(MapContext)
  const {geojson, editingId} = useContext(BalDataContext)

  const isStyleLoad = useRef(false)

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
    if (isStyleLoad.current) {
      const voieTraceSource = map.getSource('voie-trace')
      voieTraceSource.setData(voieTraceData)
    }
  }, [map, voieTraceData])

  const reloadPositions = useCallback(() => {
    if (isStyleLoad.current) {
      const positionsSource = map.getSource('positions')
      positionsSource.setData(positionsData)
    }
  }, [map, positionsData])

  const reloadVoies = useCallback(() => {
    if (isStyleLoad.current) {
      const voiesSource = map.getSource('voies')
      voiesSource.setData(voiesData)
    }
  }, [map, voiesData])

  const handleLoad = useCallback(() => {
    if (map) {
      reloadVoieTrace()
      reloadPositions()
      reloadVoies()

      isStyleLoad.current = true
    }
  }, [map, reloadVoieTrace, reloadPositions, reloadVoies])

  useEffect(() => {
    reloadVoieTrace()
  }, [reloadVoieTrace])

  useEffect(() => {
    reloadPositions()
  }, [reloadPositions])

  useEffect(() => {
    reloadVoies()
  }, [reloadVoies])

  return [voieTraceData, positionsData, voiesData, handleLoad]
}

export default useSources
