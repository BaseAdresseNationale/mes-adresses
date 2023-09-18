import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Tooltip, Position, IconButton, Popover, Pane, CameraIcon, Button} from 'evergreen-ui'
import {NUMEROS_POINT, NUMEROS_LABEL, VOIE_LABEL, VOIE_TRACE_LINE, ZOOM} from '@/components/map/layers/tiles'
import LayerShowHideZoomControl from '@/components/map/controls/layer-show-hide-zoom-control'

const poiLayersIds = [
  'poi-level-1',
  'poi-level-2',
  'poi-level-3'
]

function ImageControl({map, communeNom, isToponymesDisplayed, setIsToponymeDisplayed}) {
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

  const initLayer = () => {
    setAdresseLayerIsDisplayed(true)
    setVoieLayerIsDisplayed(true)
    setIsToponymeDisplayed(true)
    setPoiLayerIsDisplayed(true)
    setAdresseLayerZoom([ZOOM.NUMEROS_ZOOM.maxZoom])
    setVoieLayerZoom([ZOOM.VOIE_ZOOM.maxZoom])
  }

  const takeScreenshot = async () => {
    function getImageBase64(map) {
      return new Promise(resolve => {
        map.once('render', () => resolve(map.getCanvas().toDataURL()))
        map.setBearing(map.getBearing())
      })
    }

    try {
      const imageBase64 = await getImageBase64(map)
      const a = document.createElement('a')
      a.href = imageBase64
      a.download = `Screenshot-${communeNom}.png`
      a.click()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Popover
      position={Position.LEFT}
      onClose={() => initLayer()}
      content={
        <Pane paddingLeft={18} paddingRight={18} paddingTop={12} width={200} height={240} display='flex' flexDirection='column'>

          <LayerShowHideZoomControl
            title='Numéros'
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

          <Button icon={CameraIcon} onClick={() => takeScreenshot(true)}>
            <CameraIcon marginRight={4} />
            Prendre une photo
          </Button>
        </Pane>
      }
    >
      <Tooltip position={Position.LEFT} content='Prendre une photo de la carte'>
        <IconButton height={29} width={29} icon={CameraIcon} />
      </Tooltip>
    </Popover>
  )
}

ImageControl.propTypes = {
  map: PropTypes.object,
  communeNom: PropTypes.string.isRequired,
  isToponymesDisplayed: PropTypes.bool.isRequired,
  setIsToponymeDisplayed: PropTypes.func.isRequired,
}

export default ImageControl
