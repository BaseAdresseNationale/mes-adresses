import React, {useRef, useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import mapbox from 'mapbox-gl'
import computeBbox from '@turf/bbox'

import style from './style'

const secureAddSource = (map, id, data) => {
  if (!map.getSource(id)) {
    map.addSource(id, {
      type: 'geojson',
      data
    })
  }
}

const interactions = [
  'scrollZoom',
  'boxZoom',
  'dragRotate',
  'dragPan',
  'keyboard',
  'doubleClickZoom',
  'touchZoomRotate'
]

const center = [
  1.1771,
  46.5693
]

const NUMEROS_MIN = 17
const DELETED_FILTER = ['!=', ['get', 'status'], 'deleted']

const voiesLayer = {
  id: 'voies',
  type: 'symbol',
  source: 'voies',
  maxzoom: NUMEROS_MIN,
  filter: DELETED_FILTER,
  paint: {
    'text-halo-blur': 0.5,
    'text-halo-color': '#ffffff',
    'text-halo-width': 2
  },
  layout: {
    'text-field': [
      'format',
      ['upcase', ['get', 'nomVoie']],
      {'font-scale': 0.8},
      '\n',
      {},
      ['downcase', ['get', 'numerosCount']],
      {'font-scale': 0.6},
      ' numéros',
      {'font-scale': 0.6}
    ],
    'text-anchor': 'top',
    'text-font': ['Noto Sans Regular']
  }
}

function Map({interactive, data}) {
  const mapRef = useRef(null)
  const map = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    map.current = new mapbox.Map({
      container: mapRef.current,
      style,
      interactive,
      center,
      zoom: 5.8
    })
  }, [])

  useEffect(() => {
    const onStyleData = () => setReady(true)
    map.current.on('styledata', onStyleData)

    return () => {
      map.current.off('styledata', onStyleData)
    }
  }, [map])

  useEffect(() => {
    const method = interactive ? 'enable' : 'disable'

    for (const interaction of interactions) {
      map.current[interaction][method]()
    }
  }, [interactive])

  useEffect(() => {
    if (data && ready) {
      const bbox = computeBbox(data)

      secureAddSource(map.current, 'voies', data)
      map.current.addLayer(voiesLayer)

      map.current.fitBounds(bbox, {
        padding: 100,
        linear: true,
        maxZoom: 16,
        duration: 0
      })

      return () => {
        map.current.removeSource('voies')
      }
    }

    map.current.easeTo({
      center,
      duration: 0
    })
  }, [data, ready])

  return (
    <>
      <div ref={mapRef} className='container' />
      {!interactive && (
        <div className='hide' />
      )}

      <style jsx>{`
        .container {
          position: fixed;
          height: 100%;
          width: 100%;
        }

        .hide {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  )
}

Map.propTypes = {
  interactive: PropTypes.bool
}

Map.defaultProps = {
  interactive: true
}

export default Map
