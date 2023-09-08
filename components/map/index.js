import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {Pane} from 'evergreen-ui'

import MapLoader from '@/components/map/loader'

const Map = dynamic(() => import('./map'), {
  ssr: false,
  loading: props => (
    <MapLoader {...props} />
  )
})

function MapWrapper({left, top, bottom, ...props}) {
  return (
    <Pane
      position='fixed'
      display='flex'
      transition='left 0.3s'
      top={top}
      right={0}
      bottom={bottom}
      left={left}
      zIndex={1}
    >
      <Map {...props} />
    </Pane>
  )
}

MapWrapper.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  bottom: PropTypes.number,
}

MapWrapper.defaultProps = {
  top: 0,
  left: 0,
  bottom: 0
}

export default MapWrapper
