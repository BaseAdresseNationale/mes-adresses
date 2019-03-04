import React from 'react'
import dynamic from 'next/dynamic'
import {Pane} from 'evergreen-ui'

import MapLoader from './loader'

const Map = dynamic(() => import('./map'), {
  ssr: false,
  loading: props => (
    <MapLoader {...props} />
  )
})

function MapWrapper(props) {
  return (
    <Pane position='fixed' display='flex' top={0} right={0} bottom={0} left={0}>
      <Map {...props} />
    </Pane>
  )
}

export default MapWrapper
