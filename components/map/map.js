import {useState, useMemo, useEffect, useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import MapGl from 'react-map-gl'
import {fromJS} from 'immutable'
import {Pane, EyeOffIcon, EyeOpenIcon} from 'evergreen-ui'

import MapContext from '@/contexts/map'
import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'
import DrawContext from '@/contexts/draw'
import ParcellesContext from '@/contexts/parcelles'

import {vector, ortho, planIGN} from '@/components/map/styles'
import EditableMarker from '@/components/map/editable-marker'
import NumerosMarkers from '@/components/map/numeros-markers'
import ToponymeMarker from '@/components/map/toponyme-marker'
import Draw from '@/components/map/draw'
import Control from '@/components/map/controls/control'
import NavControl from '@/components/map/controls/nav-control'
import StyleSelector from '@/components/map/controls/style-selector'
import AddressEditorControl from '@/components/map/controls/address-editor-control'
import useBounds from '@/components/map/hooks/bounds'
import useSources from '@/components/map/hooks/sources'
import useLayers from '@/components/map/hooks/layers'
import useHovered from '@/components/map/hooks/hovered'

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

function Map({isAddressFormOpen, handleAddressForm, hasCadastre}) {
  const router = useRouter()
  const {map, setMap, style, setStyle, defaultStyle, viewport, setViewport, isCadastreDisplayed, setIsCadastreDisplayed} = useContext(MapContext)
  const {isParcelleSelectionEnabled, handleParcelle} = useContext(ParcellesContext)

  const [isLabelsDisplayed, setIsLabelsDisplayed] = useState(true)
  const [isContextMenuDisplayed, setIsContextMenuDisplayed] = useState(null)
  const [editPrevStyle, setEditPrevSyle] = useState(defaultStyle)
  const [mapStyle, setMapStyle] = useState(getBaseStyle(defaultStyle))

  const {balId} = router.query

  const {
    commune,
    voie,
    toponyme,
    numeros,
    toponymes,
    editingId,
    setEditingId,
    isEditing
  } = useContext(BalDataContext)
  const {modeId} = useContext(DrawContext)
  const {token} = useContext(TokenContext)

  const [hovered, setHovered, handleHover] = useHovered()
  const sources = useSources(voie, toponyme, hovered, editingId)
  const bounds = useBounds(commune, voie, toponyme)
  const layers = useLayers(voie, sources, isCadastreDisplayed, style)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [setMap])

  const interactiveLayerIds = useMemo(() => {
    const layers = []

    if (isParcelleSelectionEnabled && isCadastreDisplayed) {
      return ['parcelles-fill']
    }

    if (sources.some(({name}) => name === 'voies')) {
      layers.push('voie-trace-line')
    }

    if (sources.some(({name}) => name === 'positions')) {
      layers.push('numeros-point', 'numeros-label')
    }

    if (!voie && sources.some(({name}) => name === 'voies')) {
      layers.push('voie-label')
    }

    return layers
  }, [isParcelleSelectionEnabled, sources, voie, isCadastreDisplayed])

  const onClick = useCallback(event => {
    const feature = event?.features[0]

    if (feature?.source === 'cadastre' && feature?.state.hover) {
      handleParcelle(feature.properties.id)
    }

    if (feature && feature.properties.idVoie && !isEditing) {
      const {idVoie} = feature.properties
      if (feature.layer.id === 'voie-trace-line' && voie && idVoie === voie._id) {
        setEditingId(voie._id)
      } else {
        router.push(
          `/bal/voie?balId=${balId}&codeCommune=${commune.code}&idVoie=${idVoie}`,
          `/bal/${balId}/communes/${commune.code}/voies/${idVoie}`
        )
      }
    }

    setIsContextMenuDisplayed(null)
  }, [router, balId, commune, setEditingId, isEditing, voie, handleParcelle])

  const handleCursor = useCallback(({isHovering}) => {
    if (modeId === 'drawLineString') {
      return 'crosshair'
    }

    return isHovering ? 'pointer' : 'default'
  }, [modeId])

  useEffect(() => {
    if (sources.length > 0) {
      setMapStyle(generateNewStyle(style, sources, layers))
    } else {
      setMapStyle(getBaseStyle(style))
    }
  }, [sources, layers, style, defaultStyle])

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
        setViewport(viewport => ({...viewport}))
      }
    }
  }, [map, bounds, setViewport])

  return (
    <Pane display='flex' flexDirection='column' flex={1}>
      <StyleSelector
        style={style}
        handleStyle={setStyle}
        hasCadastre={hasCadastre}
        isCadastreDisplayed={isCadastreDisplayed}
        handleCadastre={setIsCadastreDisplayed}
      />

      <Pane
        position='absolute'
        className='mapboxgl-ctrl-group mapboxgl-ctrl'
        top={88}
        right={16}
        zIndex={2}
      >

        {(voie || (toponymes && toponymes.length > 0)) && (
          <Control
            icon={isLabelsDisplayed ? EyeOffIcon : EyeOpenIcon}
            isEnabled={isLabelsDisplayed}
            enabledHint={numeros ? 'Masquer les détails' : 'Masquer les toponymes'}
            disabledHint={numeros ? 'Afficher les détails' : 'Afficher les toponymes'}
            onChange={setIsLabelsDisplayed}
          />
        )}
      </Pane>

      {token && (
        <Pane position='absolute' zIndex={1} top={130} right={15}>
          <AddressEditorControl
            isAddressFormOpen={isAddressFormOpen}
            handleAddressForm={handleAddressForm}
            isDisabled={isEditing && !isAddressFormOpen}
          />
        </Pane>
      )}

      <Pane display='flex' flex={1}>
        <MapGl
          ref={mapRef}
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
          onMouseLeave={() => setHovered(null)}
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
  isAddressFormOpen: PropTypes.bool.isRequired,
  handleAddressForm: PropTypes.func.isRequired,
  hasCadastre: PropTypes.bool.isRequired
}

export default Map

