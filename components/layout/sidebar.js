import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Icon} from 'evergreen-ui'

function Sidebar({isHidden, size, onToggle, ...props}) {
  return (
    <Pane
      position='fixed'
      height='100vh'
      width={size}
      transition='left 0.3s'
      maxWidth='100vw'
      left={isHidden ? -size : 0}
      right='auto'
      zIndex={2}
    >
      <Button
        position='absolute'
        paddingX={8}
        height={50}
        left={size}
        border='muted'
        top={15}
        elevation={0}
        borderRadius={0}
        onClick={onToggle}
      >
        <Icon
          icon={isHidden ? 'chevron-right' : 'chevron-left'}
        />
      </Button>

      <Pane
        height='100vh'
        maxHeight='100vh'
        width={size}
        flex={1}
        overflow='hidden'
        {...props}
      />
    </Pane>
  )
}

Sidebar.propTypes = {
  isHidden: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired
}

Sidebar.defaultProps = {
  isHidden: false
}

export default Sidebar
