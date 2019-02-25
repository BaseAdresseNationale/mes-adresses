import React, {forwardRef} from 'react'
import dynamic from 'next/dynamic'
import {Pane} from 'evergreen-ui'

import MapLoader from './loader'

const Map = dynamic(() => import('./map'), {
  ssr: false,
  loading: props => (
    <MapLoader {...props} />
  )
})

function MapWrapper(props, ref) {
  return (
    <Pane position='fixed' display='flex' top={0} right={0} bottom={0} left={0}>
      <Map ref={ref} {...props} />
    </Pane>
  )
}

export default forwardRef(MapWrapper)
