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

const settings = {
  maxZoom: 19
}

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

function Map({interactive, style: defaultStyle, baseLocale, commune, voie}) {
  const [map, setMap] = useState(null)
  const [showNumeros, setShowNumeros] = useState(true)
  const [hovered, setHovered] = useState(null)
  const [viewport, setViewport] = useState(defaultViewport)
  const [style, setStyle] = useState(defaultStyle)
  const [mapStyle, setMapStyle] = useState(getBaseStyle(defaultStyle))

  const {numeros, toponymes, editingId} = useContext(BalDataContext)

  const sources = useSources(voie, hovered)
  const bounds = useBounds(commune, voie)
  const layers = useLayers(voie, style)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [])

  const interactiveLayerIds = useMemo(() => {
    if (editingId) {
      return null
    }

    return [
      'numeros-point',
      'numeros-hovered'
    ]
  }, [commune, voie, editingId])

  const onViewportChange = useCallback(viewport => {
    setViewport(viewport)
  }, [])

  const onShowNumeroChange = useCallback(value => {
    setShowNumeros(value)
  }, [])

  const onClick = useCallback(event => {
    const feature = event.features && event.features[0]

    if (feature) {
      const {id} = feature.layer
      if (id === 'voie-label' || id === 'numeros-hovered') {
        const {idVoie} = feature.properties
        return Router.push(
          `/bal/voie?balId=${baseLocale._id}&codeCommune=${commune.code}&idVoie=${idVoie}`,
          `/bal/${baseLocale._id}/communes/${commune.code}/voies/${idVoie}`
        )
      }
    }
  }, [baseLocale, commune, editingId])

  const onHover = useCallback(event => {
    const feature = event.features && event.features[0]

    if (feature) {
      const {idVoie} = feature.properties
      setHovered(idVoie)
    } else {
      setHovered(null)
    }
  }, [])

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
      {...settings}
      {...getInteractionProps(interactive)}
      interactiveLayerIds={interactiveLayerIds}
      onClick={onClick}
      onHover={onHover}
      onViewportChange={onViewportChange}
    >
      {interactive && (
        <>
          <NavControl onViewportChange={onViewportChange} />
          <StyleSwitch style={style} setStyle={setStyle} />
        </>
      )}

      {(voie || (toponymes && toponymes.length)) && (
        <NumeroSwitch
          enabled={showNumeros}
          enabledHint={toponymes ? 'Masquer les toponymes' : 'Masquer les numéros'}
          disabledHint={toponymes ? 'Afficher les toponymes' : 'Afficher les numéros'}
          onChange={onShowNumeroChange}
        />
      )}

      {voie && numeros && numeros.map(numero => (
        <NumeroMarker
          key={numero._id}
          numero={numero}
          colorSeed={numero.voie}
          showLabel={showNumeros}
        />
      ))}

      {toponymes && toponymes.map(toponyme => (
        <NumeroMarker
          key={toponyme._id}
          numero={toponyme}
          labelProperty='nom'
          showLabel={showNumeros}
        />
      ))}

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
