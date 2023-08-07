import PropTypes from 'prop-types'
import {Switch, Pane, Label, InfoSignIcon, Tooltip} from 'evergreen-ui'
import {Range, getTrackBackground} from 'react-range'
import {ZOOM} from '@/components/map/layers/tiles'

function LayerShowHideZoomControl({title, isDiplayed, setIsDiplayed, zoom, setZoom}) {
  return (
    <Pane marginBottom={4}>
      <Pane display='flex' flexDirection='row' alignItems='center' justifyContent='space-between' marginBottom='8px'>
        <Pane display='flex' flexDirection='row'>
          <Label display='block' marginRight={4}>{title}</Label>
          {(zoom && zoom.length > 0) &&
            <Tooltip content={`Ajustez la distance d‘affichage des ${title}.`} >
              <InfoSignIcon size={10} color='grey' />
            </Tooltip>}
        </Pane>
        <Pane display='flex' flexDirection='row' alignItems='center'>
          <Switch height={24} checked={isDiplayed} onChange={() => setIsDiplayed(!isDiplayed)} />
        </Pane>
      </Pane>
      {(zoom && zoom.length > 0) &&
        <Pane marginBottom={8}>
          <Range
            step={1}
            min={ZOOM.ALL.minZoom}
            max={ZOOM.ALL.maxZoom}
            values={zoom}
            onChange={values => setZoom(values)}
            renderTrack={({props, children}) => (
              <div
                {...props}
                style={{
                  height: '12px',
                  borderRadius: '12px',
                  width: '100%',
                  background: getTrackBackground({
                    values: zoom,
                    colors: ['#3366FF', '#CCC'],
                    min: ZOOM.ALL.minZoom,
                    max: ZOOM.ALL.maxZoom
                  }),
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({props}) => (
              <div
                {...props}
                style={{
                  height: '20px',
                  width: '20px',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  border: '1px #ccc solid',
                }}
              />
            )}
          />
        </Pane>}
    </Pane>
  )
}

LayerShowHideZoomControl.defaultProps = {
  zoom: null,
  setZoom: null,
}

LayerShowHideZoomControl.propTypes = {
  title: PropTypes.string.isRequired,
  isDiplayed: PropTypes.bool.isRequired,
  setIsDiplayed: PropTypes.func.isRequired,
  zoom: PropTypes.array,
  setZoom: PropTypes.func,
}

export default LayerShowHideZoomControl
