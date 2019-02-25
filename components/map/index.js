import React from 'react'
import dynamic from 'next/dynamic'

import MapLoader from './loader'

const Map = dynamic(() => import('./map'), {
  ssr: false,
  loading: props => (
    <MapLoader {...props} />
  )
})

function MapWrapper(props) {
  return (
    <Map {...props} />
  )
}

export default MapWrapper
