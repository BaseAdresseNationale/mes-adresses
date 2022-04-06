import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {Pane} from 'evergreen-ui'

import MapLoader from '@/components/map/loader'

const Map = dynamic(() => import('./map'), { // eslint-disable-line node/no-unsupported-features/es-syntax
  ssr: false,
  loading: props => (
    <MapLoader {...props} />
  )
})

function MapWrapper({left, top, ...props}) {
  return (
    <Pane
      position='fixed'
      display='flex'
      transition='left 0.3s'
      top={top}
      right={0}
      bottom={0}
      left={left}
      zIndex={1}
    >
      <Map {...props} />
    </Pane>
  )
}

MapWrapper.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number
}

MapWrapper.defaultProps = {
  top: 0,
  left: 0
}

export default MapWrapper
