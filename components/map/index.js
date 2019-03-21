import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {Pane} from 'evergreen-ui'

import MapLoader from './loader'

const Map = dynamic(() => import('./map'), {
  ssr: false,
  loading: props => (
    <MapLoader {...props} />
  )
})

function MapWrapper({animate, left, ...props}) {
  return (
    <Pane
      position='fixed'
      display='flex'
      transition={animate ? 'left 0.3s' : null}
      top={0}
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
  animate: PropTypes.bool,
  left: PropTypes.number
}

MapWrapper.defaultProps = {
  animate: false,
  left: 0
}

export default MapWrapper
