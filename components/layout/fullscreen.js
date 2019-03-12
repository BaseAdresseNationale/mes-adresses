import React from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

function Fullscreen({isOpen, size, onToggle, ...props}) {
  return (
    <Pane
      position='fixed'
      width='100%'
      height='100%'
      display='flex'
      flexGrow='1'
      alignItems='center'
      justifyContent='center'
      zIndex={2}
    >
      <Pane
        width='100%'
        height='90%'
        overflow='hidden'
        marginX={24}
        flex={1}
        maxWidth={1200}
        {...props}
      />
    </Pane>
  )
}

Fullscreen.propTypes = {
  children: PropTypes.node.isRequired,

  // Ignored props
  isOpen: PropTypes.bool,
  size: PropTypes.number,
  onToggle: PropTypes.func
}

Fullscreen.defaultProps = {
  isOpen: null,
  size: null,
  onToggle: null
}

export default Fullscreen
