import React from 'react'
import {Pane} from 'evergreen-ui'

function Fullscreen({...props}) {
  return (
    <Pane
      display='flex'
      width='100%'
      height='100%'
      flex={1}
      {...props}
    />
  )
}

export default Fullscreen
