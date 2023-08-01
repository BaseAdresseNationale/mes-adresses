import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Tooltip, Position, IconButton, MapIcon, Popover, Pane} from 'evergreen-ui'
import {NUMEROS_POINT, NUMEROS_LABEL, VOIE_LABEL, VOIE_TRACE_LINE, ZOOM} from '@/components/map/layers/tiles'
import LayerShowHideZoomControl from '@/components/map/controls/layer-show-hide-zoom-control'

const poiLayersIds = [
  'poi-level-1',
  'poi-level-2',
  'poi-level-3'
]

function MapLayerControl({map, isToponymesDisplayed, setIsToponymeDisplayed}) {
  const [adresseLayerZoom, setAdresseLayerZoom] = useState([ZOOM.NUMEROS_ZOOM.maxZoom])
  const [voieLayerZoom, setVoieLayerZoom] = useState([ZOOM.VOIE_ZOOM.maxZoom])
  const [adresseLayerIsDisplayed, setAdresseLayerIsDisplayed] = useState(true)
  const [voieLayerIsDisplayed, setVoieLayerIsDisplayed] = useState(true)
  const [poiLayerIsDisplayed, setPoiLayerIsDisplayed] = useState(true)

  useEffect(() => {
    if (map) {
      if (map && map.getLayer(VOIE_LABEL)) {
        map.setLayerZoomRange(VOIE_LABEL, ZOOM.ALL.minZoom, voieLayerZoom[0])
      }

      if (map.getLayer(VOIE_TRACE_LINE)) {
        map.setLayerZoomRange(VOIE_TRACE_LINE, ZOOM.ALL.minZoom, voieLayerZoom[0])
      }
    }
  }, [map, voieLayerZoom])

  useEffect(() => {
    if (map) {
      if (map.getLayer(NUMEROS_POINT)) {
        map.setLayerZoomRange(NUMEROS_POINT, ZOOM.ALL.min, adresseLayerZoom[0])
      }

      if (map.getLayer(NUMEROS_LABEL)) {
        map.setLayerZoomRange(NUMEROS_LABEL, adresseLayerZoom[0], ZOOM.ALL.maxZoom)
      }
    }
  }, [map, adresseLayerZoom])

  useEffect(() => {
    if (map) {
      if (map.getLayer(NUMEROS_POINT)) {
        map.setLayoutProperty(NUMEROS_POINT, 'visibility', adresseLayerIsDisplayed ? 'visible' : 'none')
      }

      if (map.getLayer(NUMEROS_LABEL)) {
        map.setLayoutProperty(NUMEROS_LABEL, 'visibility', adresseLayerIsDisplayed ? 'visible' : 'none')
      }
    }
  }, [map, adresseLayerIsDisplayed])

  useEffect(() => {
    if (map) {
      if (map.getLayer(VOIE_LABEL)) {
        map.setLayoutProperty(VOIE_LABEL, 'visibility', voieLayerIsDisplayed ? 'visible' : 'none')
      }

      if (map.getLayer(VOIE_TRACE_LINE)) {
        map.setLayoutProperty(VOIE_TRACE_LINE, 'visibility', voieLayerIsDisplayed ? 'visible' : 'none')
      }
    }
  }, [map, voieLayerIsDisplayed])

  useEffect(() => {
    if (map) {
      poiLayersIds.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', poiLayerIsDisplayed ? 'visible' : 'none')
        }
      })
    }
  }, [map, poiLayerIsDisplayed])

  return (
    <Popover
      position={Position.LEFT}
      content={
        <Pane paddingLeft={18} paddingRight={18} paddingTop={12} width={200} height={200} display='flex' flexDirection='column'>

          <LayerShowHideZoomControl
            title='Adresses'
            isDiplayed={adresseLayerIsDisplayed}
            setIsDiplayed={setAdresseLayerIsDisplayed}
            zoom={adresseLayerZoom}
            setZoom={setAdresseLayerZoom}
          />

          <LayerShowHideZoomControl
            title='Voies'
            isDiplayed={voieLayerIsDisplayed}
            setIsDiplayed={setVoieLayerIsDisplayed}
            zoom={voieLayerZoom}
            setZoom={setVoieLayerZoom}
          />

          <LayerShowHideZoomControl
            title='Toponymes'
            isDiplayed={isToponymesDisplayed}
            setIsDiplayed={setIsToponymeDisplayed}
          />

          <LayerShowHideZoomControl
            title='Points d‘intérets'
            isDiplayed={poiLayerIsDisplayed}
            setIsDiplayed={setPoiLayerIsDisplayed}
          />

        </Pane>
      }
    >
      <Tooltip position={Position.LEFT} content='Ajuster les Claques'>
        <IconButton icon={MapIcon} />
      </Tooltip>
    </Popover>
  )
}

MapLayerControl.propTypes = {
  map: PropTypes.object,
  isToponymesDisplayed: PropTypes.bool.isRequired,
  setIsToponymeDisplayed: PropTypes.func.isRequired,
}

export default MapLayerControl
