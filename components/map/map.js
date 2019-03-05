import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import MapGl from 'react-map-gl'
import {fromJS} from 'immutable'
import WebMercatorViewport from 'viewport-mercator-project'
import {merge} from '@mapbox/geojson-merge'
import bbox from '@turf/bbox'

import useWindowSize from '../../hooks/window-size'

import {vector, ortho} from './styles'

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

function getBaseStyle(style) {
  switch (style) {
    case 'ortho':
      return ortho

    case 'vector':
      return vector

    default:
      return vector
  }
}

function generateNewStyle(style, sources, layers) {
  let newStyle = getBaseStyle(style)

  for (const {name, data} of sources) {
    newStyle = newStyle.setIn(['sources', name], fromJS({type: 'geojson', data}))
  }

  return newStyle.updateIn(['layers'], arr => arr.push(...layers))
}

function Map({children, sources, layers, interactive, offset, style}) {
  const windowSize = useWindowSize()
  const [viewport, setViewport] = useState(defaultViewport)
  const [mapStyle, setMapStyle] = useState(getBaseStyle(style))

  useEffect(() => {
    if (sources && sources.length > 0) {
      setMapStyle(generateNewStyle(style, sources, layers))

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
          left: offset + 80
        }}
      )

      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom
      })
    } else {
      setMapStyle(getBaseStyle(style))
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
      mapStyle={mapStyle}
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
  interactive: PropTypes.bool,
  offset: PropTypes.number,
  style: PropTypes.oneOf([
    'ortho',
    'vector'
  ])
}

Map.defaultProps = {
  children: null,
  sources: null,
  layers: null,
  interactive: true,
  offset: 0,
  style: 'ortho'
}

export default Map
