import React, {useState, useMemo, useEffect, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import MapGl from 'react-map-gl'
import {fromJS} from 'immutable'
import {Pane, SelectMenu, Button, Position, MapIcon, MapMarkerIcon, EyeOffIcon, EyeOpenIcon} from 'evergreen-ui'

import MapContext from '../../contexts/map'
import BalDataContext from '../../contexts/bal-data'
import TokenContext from '../../contexts/token'
import DrawContext from '../../contexts/draw'

import {addNumero, addToponyme, addVoie} from '../../lib/bal-api'

import AddressEditor from '../bal/address-editor'

import {vector, ortho, vectorCadastre} from './styles'

import NavControl from './nav-control'
import EditableMarker from './editable-marker'
import Control from './control'
import NumeroMarker from './numero-marker'
import ToponymeMarker from './toponyme-marker'
import Draw from './draw'

import useBounds from './hooks/bounds'
import useSources from './hooks/sources'
import useLayers from './hooks/layers'

const settings = {
  maxZoom: 19
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

const mapStyles = [
  {label: 'Plan OpenMapTiles', value: 'vector'},
  {label: 'Photographie aérienne', value: 'ortho'},
  {label: 'Plan cadastral', value: 'vector-cadastre'}
]

function getBaseStyle(style) {
  switch (style) {
    case 'ortho':
      return ortho

    case 'vector':
      return vector

    case 'vector-cadastre':
      return vectorCadastre

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

function Map({interactive, style: defaultStyle, commune, voie, toponyme}) {
  const router = useRouter()
  const {viewport, setViewport} = useContext(MapContext)

  const [map, setMap] = useState(null)
  const [showNumeros, setShowNumeros] = useState(true)
  const [openForm, setOpenForm] = useState(false)
  const [showContextMenu, setShowContextMenu] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [style, setStyle] = useState(defaultStyle)
  const [editPrevStyle, setEditPrevSyle] = useState(defaultStyle)
  const [mapStyle, setMapStyle] = useState(getBaseStyle(defaultStyle))
  const [showPopover, setShowPopover] = useState(false)
  const [isToponyme, setIsToponyme] = useState(false)

  const {
    baseLocale,
    numeros,
    toponymes,
    editingId,
    setEditingId,
    setIsEditing,
    reloadVoies,
    reloadNumeros,
    isEditing
  } = useContext(BalDataContext)
  const {modeId} = useContext(DrawContext)
  const {token} = useContext(TokenContext)

  const sources = useSources(voie, toponyme, hovered, editingId)
  const bounds = useBounds(commune, voie, toponyme)
  const layers = useLayers(voie, sources, style)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [])

  const interactiveLayerIds = useMemo(() => {
    const layers = []

    if (editingId) {
      return null
    }

    if (sources.find(({name}) => name === 'voies')) {
      layers.push('voie-trace-line')
    }

    if (sources.find(({name}) => name === 'positions')) {
      layers.push('numeros-point', 'numeros-label')
    }

    if (!voie && sources.find(({name}) => name === 'voies')) {
      layers.push('voie-label')
    }

    return layers
  }, [editingId, sources, voie])

  const onShowNumeroChange = useCallback(value => {
    setShowNumeros(value)
  }, [])

  const onClick = useCallback(event => {
    const feature = event.features && event.features[0]

    if (feature && feature.properties.idVoie && !isEditing) {
      const {idVoie} = feature.properties
      if (feature.layer.id === 'voie-trace-line' && voie && idVoie === voie._id) {
        setEditingId(voie._id)
      } else {
        router.push(
          `/bal/voie?balId=${baseLocale._id}&codeCommune=${commune.code}&idVoie=${idVoie}`,
          `/bal/${baseLocale._id}/communes/${commune.code}/voies/${idVoie}`
        )
      }
    }

    setShowContextMenu(null)
  }, [router, baseLocale, commune, setEditingId, isEditing, voie])

  const onHover = useCallback(event => {
    const feature = event.features && event.features[0]

    if (feature) {
      const {idVoie} = feature.properties
      setHovered(idVoie)
    }
  }, [])

  const reloadView = useCallback((idVoie, isVoiesList, isNumeroCreated) => {
    if (voie && voie._id === idVoie) { // Numéro créé sur la voie en cours
      reloadNumeros()
    } else if (isNumeroCreated) { // Numéro créé depuis la vue commune ou une autre voie
      router.push(
        `/bal/voie?balId=${baseLocale._id}&codeCommune=${commune.code}&idVoie=${idVoie}`,
        `/bal/${baseLocale._id}/communes/${commune.code}/voies/${idVoie}`
      )
    } else if (isVoiesList) { // Toponyme créé depuis la vue commune
      reloadVoies()
    } else { // Toponyme créé depuis la vue voie
      router.push(
        `/bal/commune?balId=${baseLocale._id}&codeCommune=${commune.code}`,
        `/bal/${baseLocale._id}/communes/${commune.code}`
      )
    }
  }, [router, baseLocale._id, commune, voie, reloadNumeros, reloadVoies])

  const onAddAddress = useCallback(async (voieData, numero) => {
    let editedVoie = voieData

    if (!editedVoie._id) {
      editedVoie = await addVoie(baseLocale._id, commune.code, editedVoie, token)
    }

    if (numero) {
      await addNumero(editedVoie._id, numero, token)
    }

    setOpenForm(false)
    reloadView(editedVoie._id, Boolean(!voie), Boolean(numero))
  }, [baseLocale._id, commune, voie, token, reloadView])

  const onAddToponyme = useCallback(async toponymeData => {
    const editedToponyme = await addToponyme(baseLocale._id, commune.code, toponymeData, token)

    setOpenForm(false)
    router.push(
      `/bal/toponyme?balId=${baseLocale._id}&codeCommune=${commune.code}&idToponyme=${editedToponyme._id}`,
      `/bal/${baseLocale._id}/communes/${commune.code}/toponymes/${editedToponyme._id}`
    )
  }, [baseLocale._id, commune, token, router])

  useEffect(() => {
    if (sources.length > 0) {
      setMapStyle(generateNewStyle(style, sources, layers))
    } else {
      setMapStyle(getBaseStyle(interactive ? style : defaultStyle))
    }
  }, [interactive, sources, layers, style, defaultStyle])

  useEffect(() => {
    setStyle(prevStyle => {
      if (modeId) {
        setEditPrevSyle(prevStyle)
        return 'ortho'
      }

      return editPrevStyle
    })
  }, [modeId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (map) {
      if (bounds === null) {
        setViewport(viewport => ({...viewport}))
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
  }, [map, bounds, setViewport])

  useEffect(() => {
    setIsEditing(openForm)
  }, [setIsEditing, openForm])

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
          getCursor={() => modeId === 'drawLineString' ? 'crosshair' : 'default'}
          onClick={onClick}
          onHover={onHover}
          onMouseLeave={() => setHovered(null)}
          onViewportChange={setViewport}
        >

          {interactive && (
            <>
              <NavControl onViewportChange={setViewport} />
              <Pane
                position='absolute'
                display='flex'
                left={16}
                bottom={16}
                border='none'
                elevation={2}
                zIndex={2}
                cursor='pointer'
                onClick={() => setShowPopover(!showPopover)}
              >
                <SelectMenu
                  position={Position.TOP_LEFT}
                  title='Choix du fond de carte'
                  hasFilter={false}
                  height={150}
                  options={mapStyles}
                  selected={style}
                  onSelect={style => setStyle(style.value)}
                >
                  <Button><MapIcon /></Button>
                </SelectMenu>
              </Pane>
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
                icon={showNumeros ? EyeOffIcon : EyeOpenIcon}
                enabled={showNumeros}
                enabledHint={toponymes ? 'Masquer les toponymes' : 'Masquer les numéros'}
                disabledHint={toponymes ? 'Afficher les toponymes' : 'Afficher les numéros'}
                onChange={onShowNumeroChange}
              />
            )}

            {token && commune && (
              <Control
                icon={MapMarkerIcon}
                enabled={openForm}
                isDisabled={isEditing}
                enabledHint='Annuler'
                disabledHint='Créer une adresse'
                onChange={setOpenForm}
              />
            )}
          </Pane>

          {(voie || toponyme) && !modeId && numeros && numeros.map(numero => (
            <NumeroMarker
              key={numero._id}
              numero={toponyme ? {...numero, numeroComplet: `${numero.numero}${numero.suffixe || ''}`} : numero}
              colorSeed={toponyme ? numero.voie._id : voie._id}
              showLabel={showNumeros}
              showContextMenu={numero._id === showContextMenu}
              setShowContextMenu={setShowContextMenu}
            />
          ))}

          {toponymes && toponymes.map(toponyme => (
            <ToponymeMarker
              key={toponyme._id}
              initialToponyme={toponyme}
              showLabel={showNumeros}
              showContextMenu={toponyme._id === showContextMenu}
              setShowContextMenu={setShowContextMenu}
            />
          ))}

          {isEditing && (
            <EditableMarker
              style={style || defaultStyle}
              idVoie={voie ? voie._id : null}
              isToponyme={isToponyme}
              viewport={viewport}
            />
          )}

          <Draw />
        </MapGl>
      </Pane>

      {commune && openForm && (
        <Pane padding={20} background='white'>
          <AddressEditor
            isToponyme={isToponyme}
            setIsToponyme={setIsToponyme}
            onSubmit={isToponyme ? onAddToponyme : onAddAddress}
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
    'vector',
    'vector-cadastre'
  ]),
  commune: PropTypes.object,
  voie: PropTypes.object,
  toponyme: PropTypes.object
}

Map.defaultProps = {
  interactive: true,
  style: 'vector',
  commune: null,
  voie: null,
  toponyme: null
}

export default Map
