import React, {useState, useEffect, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import MapGl from 'react-map-gl'
import {fromJS} from 'immutable'
import WebMercatorViewport from 'viewport-mercator-project'
import {merge} from '@mapbox/geojson-merge'
import bbox from '@turf/bbox'
import buffer from '@turf/buffer'

import useWindowSize from '../../hooks/window-size'

import {vector, ortho} from './styles'
import useBal from './bal'

import StyleSwitch from './style-switch'

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

function Map({interactive, offset, style: defaultStyle, commune}) {
  const windowSize = useWindowSize()
  const [viewport, setViewport] = useState(defaultViewport)
  const [style, setStyle] = useState(defaultStyle)
  // const [sources, layers] = useBal(bal, style)
  const [mapStyle, setMapStyle] = useState(getBaseStyle(defaultStyle))

  // const interactiveLayerIds = useMemo(() => {
  //   return layers.filter(layer => layer.interactive).map(layer => layer.id)
  // }, [layers])

  const onViewportChange = useCallback(viewport => {
    setViewport(viewport)
  }, [])

  // const onClick = useCallback(event => {
  //   const feature = event.features && event.features[0]

  //   if (feature) {
  //     switch (feature.layer.id) {
  //       case 'voies-label': {
  //         console.log(feature)
  //         const {codeCommune, codeVoie} = feature.properties
  //         return Router.push(
  //           `/bal/voie?balId=${bal.id}&communeCode=${codeCommune}&codeVoie=${codeVoie}`,
  //           `/bal/${bal.id}/communes/${codeCommune}/voies/${codeVoie}`
  //         )
  //       }

  //       default:
  //         console.log('nothing')
  //     }
  //   }
  // }, [bal])

  // useEffect(() => {
  //   if (sources && sources.length > 0) {
  //     setMapStyle(generateNewStyle(style, sources, layers))
  //   } else {
  //     setMapStyle(getBaseStyle(interactive ? style : defaultStyle))
  //   }
  // }, [sources, layers, style])

  useEffect(() => {
    setMapStyle(getBaseStyle(interactive ? style : defaultStyle))
  }, [interactive, style, defaultStyle])

  // useEffect(() => {
  //   if (sources && sources.length > 0) {
  //     let data = merge(sources.map(s => s.data))

  //     if (data.features.length === 1 && data.features[0].geometry.type === 'Point') {
  //       data = buffer(data, 0.3)
  //     }

  //     const [minLng, minLat, maxLng, maxLat] = bbox(data)

  //     const vp = new WebMercatorViewport({
  //       ...viewport,
  //       height: windowSize.innerHeight,
  //       width: windowSize.innerWidth
  //     })

  //     const {longitude, latitude, zoom} = vp.fitBounds(
  //       [[minLng, minLat], [maxLng, maxLat]],
  //       {padding: {
  //         top: 80,
  //         right: 80,
  //         bottom: 80,
  //         left: offset + 80
  //       }}
  //     )

  //     setViewport(viewport => ({
  //       ...viewport,
  //       longitude,
  //       latitude,
  //       zoom
  //     }))
  //   } else {
  //     setViewport(viewport => ({
  //       ...viewport,
  //       ...defaultViewport
  //     }))
  //   }
  // }, [sources])

  useEffect(() => {
    if (commune && commune.contour) {
      const [minLng, minLat, maxLng, maxLat] = bbox(commune.contour)

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

      setViewport(viewport => ({
        ...viewport,
        longitude,
        latitude,
        zoom
      }))
    } else {
      setViewport(viewport => ({
        ...viewport,
        ...defaultViewport
      }))
    }
  }, [commune])

  return (
    <MapGl
      {...getInteractionProps(interactive)}
      {...viewport}
      reuseMap
      mapStyle={mapStyle}
      width={innerWidth}
      height={innerHeight}
      // interactiveLayerIds={interactiveLayerIds}
      onViewportChange={onViewportChange}
      // onClick={onClick}
    >
      {interactive && (
        <StyleSwitch style={style} setStyle={setStyle} offset={offset} />
      )}
    </MapGl>
  )
}

Map.propTypes = {
  interactive: PropTypes.bool,
  offset: PropTypes.number,
  style: PropTypes.oneOf([
    'ortho',
    'vector'
  ]),
  bal: PropTypes.object
}

Map.defaultProps = {
  interactive: true,
  offset: 0,
  style: 'vector',
  bal: null
}

export default Map
