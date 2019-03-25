import React, {useState, useMemo, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import MapGl from 'react-map-gl'
import {fromJS} from 'immutable'

import {vector, ortho} from './styles'

import StyleSwitch from './style-switch'
import NavControl from './nav-control'
import EditableMarker from './editable-marker'

import {getVoiesLabelLayer, getToponymesLabelLayer} from './layers/voies'
import {getNumerosPointLayer} from './layers/numeros'

import useBounds from './hooks/bounds'
import useSources from './hooks/sources'

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

function generateNewStyle(style, sources) {
  let baseStyle = getBaseStyle(style)

  for (const {name, data} of sources) {
    baseStyle = baseStyle.setIn(['sources', name], fromJS({
      type: 'geojson',
      data
    }))
  }

  return baseStyle.updateIn(['layers'], arr => arr.push(...[
    getNumerosPointLayer(style),
    getVoiesLabelLayer(style),
    getToponymesLabelLayer(style)
  ]))
}

function Map({interactive, style: defaultStyle, geojson, baseLocale, commune, voie, ...props}) {
  const [map, setMap] = useState(null)
  const [viewport, setViewport] = useState(defaultViewport)
  const [style, setStyle] = useState(defaultStyle)
  // Const [sources, layers] = useBal(bal, style)
  const [mapStyle, setMapStyle] = useState(getBaseStyle(defaultStyle))

  const sources = useSources(geojson, voie)
  const bounds = useBounds(geojson, commune, voie)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [])

  const interactiveLayerIds = useMemo(() => {
    return sources.length > 0 ? [
      'voie-label'
    ] : null
  }, [sources])

  const onViewportChange = useCallback(viewport => {
    setViewport(viewport)
  }, [])

  const onClick = useCallback(event => {
    const feature = event.features && event.features[0]

    if (feature) {
      switch (feature.layer.id) {
        case 'voie-label': {
          const {idVoie} = feature.properties
          return Router.push(
            `/bal/voie?balId=${baseLocale._id}&codeCommune=${commune.code}&idVoie=${idVoie}`,
            `/bal/${baseLocale._id}/communes/${commune.code}/voies/${idVoie}`
          )
        }

        default:
          console.log('nothing')
      }
    }
  }, [baseLocale, commune])

  useEffect(() => {
    if (sources.length > 0) {
      setMapStyle(generateNewStyle(style, sources))
    } else {
      setMapStyle(getBaseStyle(interactive ? style : defaultStyle))
    }
  }, [interactive, sources, style, defaultStyle])

  // useEffect(() => {
  //   setMapStyle(getBaseStyle(interactive ? style : defaultStyle))
  // }, [interactive, style, defaultStyle])

  // UseEffect(() => {
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
    if (map) {
      if (bounds) {
        const camera = map.cameraForBounds(bounds, {
          padding: 100
        })

        if (camera) {
          setViewport(viewport => ({
            ...viewport,
            bearing: camera.bearing,
            longitude: camera.center.lng,
            latitude: camera.center.lat,
            zoom: camera.zoom
          }))
        }
      } else {
        setViewport(viewport => ({
          ...viewport,
          ...defaultViewport
        }))
      }
    }
  }, [map, bounds])

  return (
    <MapGl
      ref={mapRef}
      reuseMap
      viewState={viewport}
      mapStyle={mapStyle}
      width='100%'
      height='100%'
      {...getInteractionProps(interactive)}
      interactiveLayerIds={interactiveLayerIds}
      onClick={onClick}
      onViewportChange={onViewportChange}
    >
      {interactive && (
        <>
          <NavControl onViewportChange={onViewportChange} />
          <StyleSwitch style={style} setStyle={setStyle} />
        </>
      )}

      <EditableMarker viewport={viewport} voie={voie} />
    </MapGl>
  )
}

Map.propTypes = {
  interactive: PropTypes.bool,
  style: PropTypes.oneOf([
    'ortho',
    'vector'
  ])
}

Map.defaultProps = {
  interactive: true,
  style: 'vector'
}

export default Map
