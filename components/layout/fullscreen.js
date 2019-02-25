import React from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

function Fullscreen({children, ...props}) {
  return (
    <Pane position='absolute' width='100%' height='100%'>
      <Pane
        width='100%'
        minHeight='90%'
        marginX='auto'
        marginY={60}
        maxWidth={1200}
        paddingX={16}
        paddingBottom={16}
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
