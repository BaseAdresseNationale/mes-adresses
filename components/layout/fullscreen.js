import React from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

function Fullscreen({children, ...props}) {
  return (
    <Pane
      position='fixed'
      width='100%'
      height='100%'
      display='flex'
      flexGrow='1'
      alignItems='center'
      justifyContent='center'
    >
      <Pane
        width='100%'
        height='90%'
        marginX={24}
        maxWidth={1200}
        {...props}
      >
        {children}
      </Pane>
    </Pane>
  )
}

Fullscreen.propTypes = {
  children: PropTypes.node.isRequired
}

export default Fullscreen
