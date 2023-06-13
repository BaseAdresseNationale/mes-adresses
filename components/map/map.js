import {useState, useMemo, useEffect, useCallback, useContext, useRef} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import MapGl, {Source, Layer} from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import {Pane, Alert, EyeOffIcon, EyeOpenIcon} from 'evergreen-ui'

import MapContext, {BAL_API_URL, SOURCE_TILE_ID} from '@/contexts/map'
import TokenContext from '@/contexts/token'
import DrawContext from '@/contexts/draw'
import ParcellesContext from '@/contexts/parcelles'
import BalDataContext from '@/contexts/bal-data'

import {cadastreLayers} from '@/components/map/layers/cadastre'
import {tilesLayers, VOIE_LABEL, VOIE_TRACE_LINE, NUMEROS_POINT, NUMEROS_LABEL} from '@/components/map/layers/tiles'
import {vector, ortho, planIGN} from '@/components/map/styles'
import EditableMarker from '@/components/map/editable-marker'
import NumerosMarkers from '@/components/map/numeros-markers'
import ToponymeMarker from '@/components/map/toponyme-marker'
import PopupFeature from '@/components/map/popup-features/popup-feature'
import Draw from '@/components/map/draw'
import Control from '@/components/map/controls/control'
import NavControl from '@/components/map/controls/nav-control'
import StyleControl from '@/components/map/controls/style-control'
import AddressEditorControl from '@/components/map/controls/address-editor-control'
import useBounds from '@/components/map/hooks/bounds'
import useHovered from '@/components/map/hooks/hovered'

const LAYERS = [
  ...cadastreLayers,
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
  const baseStyle = getBaseStyle(style)
  return baseStyle.updateIn(['layers'], arr => arr.push(...LAYERS))
}

function Map({commune, isAddressFormOpen, handleAddressForm}) {
  const router = useRouter()
  const {
    map,
    isTileSourceLoaded,
    handleMapRef,
    style,
    setStyle,
    defaultStyle,
    isStyleLoaded,
    viewport,
    setViewport,
    isCadastreDisplayed,
    setIsCadastreDisplayed
  } = useContext(MapContext)
  const {isParcelleSelectionEnabled, handleParcelle} = useContext(ParcellesContext)

  const [isLabelsDisplayed, setIsLabelsDisplayed] = useState(true)
  const [isContextMenuDisplayed, setIsContextMenuDisplayed] = useState(null)
  const [mapStyle, setMapStyle] = useState(generateNewStyle(defaultStyle))

  const {balId} = router.query
  const BAL_TILES_URL = BAL_API_URL + '/bases-locales/' + balId + '/tiles/{z}/{x}/{y}.pbf'
  const {
    voie,
    toponyme,
    numeros,
    toponymes,
    editingId,
    setEditingId,
    isEditing
  } = useContext(BalDataContext)
  const {modeId, hint} = useContext(DrawContext)
  const {token} = useContext(TokenContext)

  const communeHasOrtho = useMemo(() => commune.hasOrtho, [commune])

  const [handleHover, handleMouseLeave, featureHovered] = useHovered(map)
  const bounds = useBounds(commune, voie, toponyme)

  const prevStyle = useRef(defaultStyle)

  const updatePositionsLayer = useCallback(() => {
    if (map && isTileSourceLoaded) {
      // Filter positions of voie or toponyme
      if (voie) {
        map.setFilter(NUMEROS_POINT, ['!=', ['get', 'idVoie'], voie._id])
        map.setFilter(NUMEROS_LABEL, ['!=', ['get', 'idVoie'], voie._id])
        map.setFilter(VOIE_LABEL, ['!=', ['get', 'idVoie'], voie._id])
      } else if (toponyme) {
        map.setFilter(NUMEROS_POINT, ['!=', ['get', 'idToponyme'], toponyme._id])
        map.setFilter(NUMEROS_LABEL, ['!=', ['get', 'idToponyme'], toponyme._id])
      } else {
        // Remove filter
        map.setFilter(NUMEROS_POINT, null)
        map.setFilter(NUMEROS_LABEL, null)
        map.setFilter(VOIE_LABEL, null)
      }
    }
  }, [map, voie, toponyme, isTileSourceLoaded])

  const interactiveLayerIds = useMemo(() => {
    const layers = []

    if (isParcelleSelectionEnabled && isCadastreDisplayed) {
      return ['parcelles-fill']
    }

    if (!isEditing && isTileSourceLoaded) {
      layers.push(VOIE_TRACE_LINE, NUMEROS_POINT, NUMEROS_LABEL, VOIE_LABEL)
    }

    return layers
  }, [isEditing, isParcelleSelectionEnabled, isCadastreDisplayed, isTileSourceLoaded])

  const onClick = useCallback(event => {
    const feature = event?.features[0]

    if (feature?.source === 'cadastre') {
      handleParcelle(feature.properties.id)
    } else if (feature && feature.properties.idVoie && !isEditing) {
      const {idVoie} = feature.properties
      if (feature.layer.id === VOIE_TRACE_LINE && voie && idVoie === voie._id) {
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

      if (isTileSourceLoaded) {
        // Adapt layer paint property to map style
        const isOrtho = style === 'ortho'

        if (map.getLayer(VOIE_LABEL)) {
          map.setPaintProperty(VOIE_LABEL, 'text-halo-color', isOrtho ? '#ffffff' : '#f8f4f0')
        }

        if (map.getLayer(NUMEROS_POINT)) {
          map.setPaintProperty(NUMEROS_POINT, 'circle-stroke-color', isOrtho ? '#ffffff' : '#f8f4f0')
        }
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

  const sourceTiles = useMemo(() => {
    return {
      id: SOURCE_TILE_ID,
      type: 'vector',
      tiles: [BAL_TILES_URL],
      promoteId: 'id',
    }
  }, [BAL_TILES_URL])

  return (
    <Pane display='flex' flexDirection='column' flex={1}>
      <StyleControl
        style={style}
        handleStyle={setStyle}
        commune={commune}
        isCadastreDisplayed={isCadastreDisplayed}
        handleCadastre={setIsCadastreDisplayed}
      />

      {(voie || (toponymes && toponymes.length > 0)) && (
        <Pane
          position='absolute'
          className='maplibregl-ctrl-group maplibregl-ctrl'
          top={100}
          right={16}
          zIndex={2}
        >

          <Control
            icon={isLabelsDisplayed ? EyeOffIcon : EyeOpenIcon}
            isEnabled={isLabelsDisplayed}
            enabledHint={numeros ? 'Masquer les détails' : 'Masquer les toponymes'}
            disabledHint={numeros ? 'Afficher les détails' : 'Afficher les toponymes'}
            onChange={setIsLabelsDisplayed}
          />
        </Pane>
      )}

      {token && (
        <Pane
          position='absolute'
          zIndex={1}
          top={voie || (toponymes && toponymes.length > 0) ? 136 : 100}
          right={15}
        >
          <AddressEditorControl
            isAddressFormOpen={isAddressFormOpen}
            handleAddressForm={handleAddressForm}
            isDisabled={isEditing && !isAddressFormOpen}
          />
        </Pane>
      )}

      {hint && (
        <Pane
          zIndex={1}
          position='fixed'
          alignSelf='center'
          top={130}
        >
          <Alert title={hint} />
        </Pane>
      )}

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

          <Source {...sourceTiles} >
            { Object.values(tilesLayers).map(layer => (
              <Layer key={layer.id} {...layer} />
            ))}
          </Source>

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

          {(featureHovered !== null && viewport.zoom > 14 && featureHovered.sourceLayer !== 'voies-traces') && (
            <PopupFeature feature={featureHovered} commune={commune} />
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

