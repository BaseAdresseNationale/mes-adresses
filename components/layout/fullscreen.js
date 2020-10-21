import React from 'react'
import PropTypes from 'prop-types'
import {Pane} from 'evergreen-ui'

function Fullscreen({isOpen, isHidden, size, top, onToggle, ...props}) {
  return (
    <Pane
      display='flex'
      width='100%'
      height='100%'
      overflow='hidden'
      flex={1}
      {...props}
    />
  )
}

Fullscreen.propTypes = {
  children: PropTypes.node.isRequired,

  // Ignored props
  isOpen: PropTypes.bool,
  isHidden: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired,
  top: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired
}

Fullscreen.defaultProps = {
  isOpen: false
}

export default Fullscreen
