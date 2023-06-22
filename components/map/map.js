import {useState, useMemo, useEffect, useCallback, useContext, useRef} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import MapGl from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import {fromJS} from 'immutable'
import {Pane} from 'evergreen-ui'

import MapContext from '@/contexts/map'
import BalDataContext from '@/contexts/bal-data'
import DrawContext from '@/contexts/draw'
import ParcellesContext from '@/contexts/parcelles'

import {cadastreLayers} from '@/components/map/layers/cadastre'
import {voiesLayers} from '@/components/map/layers/voies'
import {numerosLayers} from '@/components/map/layers/numeros'

import {vector, ortho, planIGN} from '@/components/map/styles'
import EditableMarker from '@/components/map/editable-marker'
import NumerosMarkers from '@/components/map/numeros-markers'
import ToponymeMarker from '@/components/map/toponyme-marker'
import Draw from '@/components/map/draw'
import NavControl from '@/components/map/controls/nav-control'
import useBounds from '@/components/map/hooks/bounds'
import useSources from '@/components/map/hooks/sources'
import useHovered from '@/components/map/hooks/hovered'
import MapControls from './controls/map-controls'

const LAYERS = [
  ...cadastreLayers,
  ...numerosLayers,
  ...voiesLayers
]

const SOURCES = [
  {name: 'voies', data: {type: 'FeatureCollection', features: []}},
  {name: 'positions', data: {type: 'FeatureCollection', features: []}},
  {name: 'voie-trace', data: {type: 'FeatureCollection', features: []}}
]

const settings = {
  maxZoom: 19
}

const interactionProps = {
  dragPan: true,
  dragRotate: true,
  scrollZoom: true,
  touchZoom: true,
  touchRotate: true,
  keyboard: true,
  doubleClickZoom: true
}

function getBaseStyle(style) {
  switch (style) {
    case 'ortho':
      return ortho

    case 'vector':
      return vector

    case 'plan-ign':
      return planIGN
    default:
      return vector
  }
}

function generateNewStyle(style) {
  let baseStyle = getBaseStyle(style)

  for (const {name, data} of SOURCES) {
    baseStyle = baseStyle.setIn(['sources', name], fromJS({
      type: 'geojson',
      data,
      generateId: true
    }))
  }

  return baseStyle.updateIn(['layers'], arr => arr.push(...LAYERS))
}

function Map({commune, isAddressFormOpen, handleAddressForm}) {
  const router = useRouter()
  const {map, handleMapRef, style, setStyle, defaultStyle, isStyleLoaded, viewport, setViewport, isCadastreDisplayed} = useContext(MapContext)
  const {isParcelleSelectionEnabled, handleParcelle} = useContext(ParcellesContext)

  const [isLabelsDisplayed, setIsLabelsDisplayed] = useState(true)
  const [isContextMenuDisplayed, setIsContextMenuDisplayed] = useState(null)
  const [mapStyle, setMapStyle] = useState(generateNewStyle(defaultStyle))

  const {balId} = router.query

  const {
    voie,
    toponyme,
    numeros,
    toponymes,
    editingId,
    setEditingId,
    isEditing
  } = useContext(BalDataContext)
  const {modeId} = useContext(DrawContext)

  const communeHasOrtho = useMemo(() => commune.hasOrtho, [commune])

  const [handleHover, handleMouseLeave] = useHovered(map)
  const [voieTraceData, positionsData, voiesData] = useSources(isStyleLoaded)
  const bounds = useBounds(commune, voie, toponyme)

  const prevStyle = useRef(defaultStyle)

  const updatePositionsLayer = useCallback(() => {
    if (map?.getSource('positions')) {
      // Filter positions of voie or toponyme
      if (voie) {
        map.setFilter('numeros-point', ['!=', ['get', 'idVoie'], voie._id])
        map.setFilter('numeros-label', ['!=', ['get', 'idVoie'], voie._id])
        map.setFilter('voie-label', ['!=', ['get', 'idVoie'], voie._id])
      } else if (toponyme) {
        map.setFilter('numeros-point', ['!=', ['get', 'idToponyme'], toponyme._id])
        map.setFilter('numeros-label', ['!=', ['get', 'idToponyme'], toponyme._id])
      } else {
        // Remove filter
        map.setFilter('numeros-point', null)
        map.setFilter('numeros-label', null)
        map.setFilter('voie-label', null)
      }
    }
  }, [map, voie, toponyme])

  const interactiveLayerIds = useMemo(() => {
    const layers = []

    if (isParcelleSelectionEnabled && isCadastreDisplayed) {
      return ['parcelles-fill']
    }

    if (!isEditing) {
      if (voieTraceData.features.length > 0) {
        layers.push('voie-trace-line')
      }

      if (positionsData.features.length > 0) {
        layers.push('numeros-point', 'numeros-label')
      }

      if (voiesData.features.length > 0) {
        layers.push('voie-label')
      }
    }

    return layers
  }, [isEditing, isParcelleSelectionEnabled, voieTraceData, positionsData, voiesData, isCadastreDisplayed])

  const onClick = useCallback(event => {
    const feature = event?.features[0]

    if (feature?.source === 'cadastre') {
      handleParcelle(feature.properties.id)
    } else if (feature && feature.properties.idVoie && !isEditing) {
      const {idVoie} = feature.properties
      if (feature.layer.id === 'voie-trace-line' && voie && idVoie === voie._id) {
        setEditingId(voie._id)
      } else {
        router.push(
          `/bal/voie?balId=${balId}&idVoie=${idVoie}`,
          `/bal/${balId}/voies/${idVoie}`
        )
      }
    }

    setIsContextMenuDisplayed(null)
  }, [router, balId, setEditingId, isEditing, voie, handleParcelle])

  const handleCursor = useCallback(({isHovering}) => {
    if (modeId === 'drawLineString') {
      return 'crosshair'
    }

    return isHovering ? 'pointer' : 'default'
  }, [modeId])

  // Hide current voie's or toponyme's numeros
  useEffect(() => {
    updatePositionsLayer()
  }, [map, voie, toponyme, updatePositionsLayer])

  // Change map's style and adapte layers
  useEffect(() => {
    if (map) {
      setMapStyle(generateNewStyle(style))

      // Adapt layer paint property to map style
      const isOrtho = style === 'ortho'

      if (map.getLayer('voie-label')) {
        map.setPaintProperty('voie-label', 'text-halo-color', isOrtho ? '#ffffff' : '#f8f4f0')
      }

      if (map.getLayer('numeros-point')) {
        map.setPaintProperty('numeros-point', 'circle-stroke-color', isOrtho ? '#ffffff' : '#f8f4f0')
      }
    }
  }, [map, style])

  // Auto switch to ortho on draw and save previous style
  useEffect(() => {
    setStyle(style => {
      if (modeId && communeHasOrtho) {
        prevStyle.current = style
        return 'ortho'
      }

      return prevStyle.current
    })
  }, [modeId, setStyle, communeHasOrtho])

  useEffect(() => {
    if (isStyleLoaded) {
      updatePositionsLayer()
    }
  }, [isStyleLoaded, updatePositionsLayer])

  useEffect(() => {
    if (map && bounds) {
      const camera = map.cameraForBounds(bounds, {
        padding: 100
      })

      setViewport(viewport => ({
        ...viewport,
        bearing: camera.bearing,
        longitude: camera.center.lng,
        latitude: camera.center.lat,
        zoom: camera.zoom
      }))
    }
  }, [map, bounds, setViewport])

  return (
    <Pane display='flex' flexDirection='column' flex={1}>
      <MapControls
        commune={commune}
        isLabelsDisplayed={isLabelsDisplayed}
        setIsLabelsDisplayed={setIsLabelsDisplayed}
        isAddressFormOpen={isAddressFormOpen}
        handleAddressForm={handleAddressForm}
      />
      <Pane display='flex' flex={1}>
        <MapGl
          ref={handleMapRef}
          mapLib={maplibregl}
          reuseMap
          viewState={viewport}
          mapStyle={mapStyle}
          width='100%'
          height='100%'
          {...settings}
          {...interactionProps}
          interactiveLayerIds={interactiveLayerIds}
          getCursor={handleCursor}
          onClick={onClick}
          onHover={handleHover}
          onMouseLeave={handleMouseLeave}
          onMouseOut={handleMouseLeave}
          onViewportChange={setViewport}
        >

          <NavControl onViewportChange={setViewport} />

          {(voie || toponyme) && !modeId && numeros && (
            <NumerosMarkers
              numeros={numeros.filter(({_id}) => _id !== editingId)}
              voie={voie}
              isLabelDisplayed={isLabelsDisplayed}
              isContextMenuDisplayed={isContextMenuDisplayed}
              setIsContextMenuDisplayed={setIsContextMenuDisplayed}
            />
          )}

          {toponymes && toponymes.map(toponyme => (
            <ToponymeMarker
              key={toponyme._id}
              initialToponyme={toponyme}
              isLabelDisplayed={isLabelsDisplayed}
              isContextMenuDisplayed={toponyme._id === isContextMenuDisplayed}
              setIsContextMenuDisplayed={setIsContextMenuDisplayed}
            />
          ))}

          {isEditing && (
            <EditableMarker
              style={style || defaultStyle}
              idVoie={voie?._id}
              isToponyme={Boolean(toponyme)}
              viewport={viewport}
            />
          )}

          <Draw />
        </MapGl>
      </Pane>
    </Pane>
  )
}

Map.propTypes = {
  commune: PropTypes.shape({
    hasOrtho: PropTypes.bool.isRequired
  }).isRequired,
  isAddressFormOpen: PropTypes.bool.isRequired,
  handleAddressForm: PropTypes.func.isRequired
}

export default Map

