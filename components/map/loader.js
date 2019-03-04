import React from 'react'
import {Pane, Text} from 'evergreen-ui'

function MapLoader() {
  return (
    <Pane
      display='flex'
      flexGrow='1'
      alignItems='center'
      justifyContent='center'
    >
      <Text>Chargement de la carte…</Text>
    </Pane>
  )
}

export default MapLoader
