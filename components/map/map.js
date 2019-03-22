import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import MapGl from 'react-map-gl'
import {fromJS} from 'immutable'
import bbox from '@turf/bbox'

import MarkerContext from '../../contexts/marker'

import {vector, ortho} from './styles'

import StyleSwitch from './style-switch'
import NavControl from './nav-control'
import EditableMarker from './editable-marker'

import {getVoiesLabelLayer, getToponymesLabelLayer} from './bal/voies'
import {getNumerosPointLayer} from './bal/numeros'

import useBalData from './hooks/bal-data'

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

function Map({interactive, style: defaultStyle, geojson, commune, ...props}) {
  const [map, setMap] = useState(null)
  const [viewport, setViewport] = useState(defaultViewport)
  const [style, setStyle] = useState(defaultStyle)
  // Const [sources, layers] = useBal(bal, style)
  const [mapStyle, setMapStyle] = useState(getBaseStyle(defaultStyle))

  const sources = useBalData(geojson, style)

  // const interactiveLayerIds = useMemo(() => {
  //   return layers.filter(layer => layer.interactive).map(layer => layer.id)
  // }, [layers])

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [])

  const onViewportChange = useCallback(viewport => {
    setViewport(viewport)
  }, [])

  // Const onClick = useCallback(event => {
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
      if (commune) {
        const featureBbox = bbox(geojson && geojson.features.length > 0 ? geojson : commune.contour)
        const camera = map.cameraForBounds(featureBbox, {
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
  }, [map, geojson, commune])

  return (
    <MapGl
      ref={mapRef}
      reuseMap
      viewState={viewport}
      mapStyle={mapStyle}
      width={innerWidth}
      height={innerHeight}
      {...getInteractionProps(interactive)}
      // InteractiveLayerIds={interactiveLayerIds}
      // onClick={onClick}
      onViewportChange={onViewportChange}
    >
      {interactive && (
        <>
          <NavControl onViewportChange={onViewportChange} />
          <StyleSwitch style={style} setStyle={setStyle} />
        </>
      )}

      <EditableMarker viewport={viewport} />
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
