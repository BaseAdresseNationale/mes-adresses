import React, {useState, useMemo, useEffect, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import MapGl from 'react-map-gl'
import {fromJS} from 'immutable'

import BalDataContext from '../../contexts/bal-data'

import {vector, ortho} from './styles'

import StyleSwitch from './style-switch'
import NavControl from './nav-control'
import EditableMarker from './editable-marker'
import NumeroSwitch from './numero-switch'
import NumeroMarker from './numero-marker'

import useBounds from './hooks/bounds'
import useSources from './hooks/sources'
import useLayers from './hooks/layers'

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
  let baseStyle = getBaseStyle(style)

  for (const {name, data} of sources) {
    baseStyle = baseStyle.setIn(['sources', name], fromJS({
      type: 'geojson',
      data
    }))
  }

  return baseStyle.updateIn(['layers'], arr => arr.push(...layers))
}

function Map({interactive, style: defaultStyle, baseLocale, commune, voie, ...props}) {
  const [map, setMap] = useState(null)
  const [showNumeros, setShowNumeros] = useState(false)
  const [viewport, setViewport] = useState(defaultViewport)
  const [style, setStyle] = useState(defaultStyle)
  const [mapStyle, setMapStyle] = useState(getBaseStyle(defaultStyle))

  const {numeros} = useContext(BalDataContext)

  const sources = useSources(voie)
  const bounds = useBounds(commune, voie)
  const layers = useLayers(voie, style)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [])

  const interactiveLayerIds = useMemo(() => {
    return commune && !voie ? [
      'voie-label'
    ] : null
  }, [commune, voie])

  const onViewportChange = useCallback(viewport => {
    setViewport(viewport)
  }, [])

  const onShowNumeroChange = useCallback(value => {
    setShowNumeros(value)
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
          return false
      }
    }
  }, [baseLocale, commune])

  useEffect(() => {
    if (sources.length > 0) {
      setMapStyle(generateNewStyle(style, sources, layers))
    } else {
      setMapStyle(getBaseStyle(interactive ? style : defaultStyle))
    }
  }, [interactive, sources, layers, style, defaultStyle])

  useEffect(() => {
    if (map) {
      if (bounds === null) {
        setViewport(viewport => ({
          ...viewport,
          ...defaultViewport
        }))
      } else if (bounds !== false) {
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

      {voie && (
        <>
          <NumeroSwitch enabled={showNumeros} onChange={onShowNumeroChange} />

          {numeros && numeros.map(numero => (
            <NumeroMarker
              key={numero._id}
              showNumero={showNumeros}
              numero={numero}
            />
          ))}
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
