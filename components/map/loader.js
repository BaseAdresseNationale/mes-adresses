import React from 'react'
import {Pane, Spinner} from 'evergreen-ui'

function MapLoader() {
  return (
    <Pane
      display='flex'
      flexGrow='1'
      alignItems='center'
      justifyContent='center'
    >
      <Spinner size={64} />
    </Pane>
  )
}

export default MapLoader
