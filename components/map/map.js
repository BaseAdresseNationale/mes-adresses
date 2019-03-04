import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import MapGl from 'react-map-gl'
import {fromJS} from 'immutable'
import WebMercatorViewport from 'viewport-mercator-project'
import {merge} from '@mapbox/geojson-merge'
import bbox from '@turf/bbox'

import useWindowSize from '../../hooks/window-size'
import defaultStyle from './style'

const defaultViewport = {
  latitude: 46.5693,
  longitude: 1.1771,
  zoom: 6,
  transitionDuration: 0
}

function getInteractionProps(enabled) {
  return {
    dragPan: enabled,
    dragRotate: enabled,
    scrollZoom: enabled,
    touchZoom: enabled,
    touchRotate: enabled,
    keyboard: enabled,
    doubleClickZoom: enabled
  }
}

function generateNewStyle(sources, layers) {
  let newStyle = defaultStyle

  for (const {name, data} of sources) {
    newStyle = newStyle.setIn(['sources', name], fromJS({type: 'geojson', data}))
  }

  return newStyle.updateIn(['layers'], arr => arr.push(...layers))
}

function Map({children, sources, layers, interactive}) {
  const windowSize = useWindowSize()
  const [viewport, setViewport] = useState(defaultViewport)
  const [style, setStyle] = useState(defaultStyle)

  useEffect(() => {
    if (sources && sources.length > 0) {
      setStyle(generateNewStyle(sources, layers))

      const [minLng, minLat, maxLng, maxLat] = bbox(merge(sources.map(s => s.data)))

      const vp = new WebMercatorViewport({
        ...viewport,
        height: windowSize.innerHeight,
        width: windowSize.innerWidth
      })

      const {longitude, latitude, zoom} = vp.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        {padding: {
          top: 80,
          right: 80,
          bottom: 80,
          left: 580
        }}
      )

      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom
      })
    } else {
      setStyle(defaultStyle)
      setViewport({
        ...viewport,
        ...defaultViewport
      })
    }
  }, [sources, layers])

  return (
    <MapGl
      {...getInteractionProps(interactive)}
      {...viewport}
      mapStyle={style}
      width={innerWidth}
      height={innerHeight}
      onViewportChange={viewport => setViewport(viewport)}
    >
      {children}
    </MapGl>
  )
}

Map.propTypes = {
  children: PropTypes.node,
  sources: PropTypes.array,
  layers: PropTypes.array,
  interactive: PropTypes.bool
}

Map.defaultProps = {
  children: null,
  sources: null,
  layers: null,
  interactive: true
}

export default Map
