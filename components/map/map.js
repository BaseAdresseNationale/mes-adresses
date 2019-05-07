import React, {useState, useMemo, useEffect, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import MapGl from 'react-map-gl'
import {Pane} from 'evergreen-ui'
import {fromJS} from 'immutable'

import BalDataContext from '../../contexts/bal-data'
import TokenContext from '../../contexts/token'
import MarkerContext from '../../contexts/marker'

import {addNumero, addVoie} from '../../lib/bal-api'

import AddressEditor from '../bal/address-editor'

import {vector, ortho} from './styles'

import StyleSwitch from './style-switch'
import NavControl from './nav-control'
import EditableMarker from './editable-marker'
import Control from './control'
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
  const [openForm, setOpenForm] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [viewport, setViewport] = useState(defaultViewport)
  const [style, setStyle] = useState(defaultStyle)
  const [mapStyle, setMapStyle] = useState(getBaseStyle(defaultStyle))

  const {numeros, reloadNumeros, toponymes, reloadVoies, editingId} = useContext(BalDataContext)
  const {enableMarker, disableMarker} = useContext(MarkerContext)
  const {token} = useContext(TokenContext)

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
  }, [editingId])

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
    } else {
      setShowContextMenu(null)
    }
  }, [baseLocale, commune])

  const onHover = event => {
    const feature = event.features && event.features[0]

    if (feature) {
      const {idVoie} = feature.properties
      setHovered(idVoie)
    }
  }

  const onAddAddress = useCallback(async (body, idVoie) => {
    if (idVoie) {
      await addNumero(idVoie, body, token)
      await reloadNumeros(idVoie)
    } else {
      await addVoie(baseLocale._id, commune.code, body, token)
      await reloadVoies()
    }

    setOpenForm(false)
  }, [baseLocale, commune, reloadNumeros, reloadVoies, token])

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

  useEffect(() => {
    if (editingId) {
      setOpenForm(false)
    }
  }, [editingId, openForm])

  useEffect(() => {
    if (openForm) {
      enableMarker()
    } else if (!openForm && !editingId) {
      disableMarker()
    }
  }, [openForm, disableMarker, enableMarker, editingId])

  return (
    <Pane display='flex' flexDirection='column' flex={1}>
      <Pane display='flex' flex={1}>
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
          onMouseLeave={() => setHovered(null)}
          onViewportChange={onViewportChange}
        >
          {interactive && (
            <>
              <NavControl onViewportChange={onViewportChange} />
              <StyleSwitch style={style} setStyle={setStyle} />
            </>
          )}

          <Pane
            position='absolute'
            className='mapboxgl-ctrl-group mapboxgl-ctrl'
            top={88}
            right={16}
            zIndex={2}
          >

            {(voie || (toponymes && toponymes.length > 0)) && (
              <Control
                icon={showNumeros ? 'eye-off' : 'eye-open'}
                enabled={showNumeros}
                enabledHint={toponymes ? 'Masquer les toponymes' : 'Masquer les numéros'}
                disabledHint={toponymes ? 'Afficher les toponymes' : 'Afficher les numéros'}
                onChange={onShowNumeroChange}
              />
            )}

            {commune && (
              <Control
                icon='map-marker'
                enabled={openForm}
                enabledHint='Annuler'
                disabledHint='Créer une adresse'
                onChange={setOpenForm}
              />
            )}
          </Pane>

          {voie && numeros && numeros.map(numero => (
            <NumeroMarker
              key={numero._id}
              numero={numero}
              colorSeed={numero.voie}
              showLabel={showNumeros}
              showContextMenu={numero._id === showContextMenu}
              setShowContextMenu={setShowContextMenu}
            />
          ))}

          {toponymes && toponymes.map(toponyme => (
            <NumeroMarker
              key={toponyme._id}
              numero={toponyme}
              labelProperty='nom'
              showLabel={showNumeros}
              showContextMenu={toponyme._id === showContextMenu}
              setShowContextMenu={setShowContextMenu}
            />
          ))}

          <EditableMarker
            viewport={viewport}
            style={style || defaultStyle}
          />
        </MapGl>
      </Pane>

      {commune && openForm && (
        <Pane padding={20} background='white'>
          <AddressEditor
            onSubmit={onAddAddress}
            onCancel={() => setOpenForm(false)}
          />
        </Pane>
      )}
    </Pane>
  )
}

Map.propTypes = {
  interactive: PropTypes.bool,
  style: PropTypes.oneOf([
    'ortho',
    'vector'
  ]),
  baseLocale: PropTypes.object,
  commune: PropTypes.object,
  voie: PropTypes.object
}

Map.defaultProps = {
  interactive: true,
  style: 'vector',
  baseLocale: null,
  commune: null,
  voie: null
}

export default Map
