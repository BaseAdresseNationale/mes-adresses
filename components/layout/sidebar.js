import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Icon} from 'evergreen-ui'

function Sidebar({size, onToggle, ...props}) {
  return (
    <Pane
      position='fixed'
      height='100vh'
      width={size}
      maxWidth='100vw'
      left={0}
      right='auto'
      zIndex={2}
    >
      <Button
        position='fixed'
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
          icon={size === 0 ? 'chevron-right' : 'chevron-left'}
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
  children: PropTypes.node.isRequired,
  size: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired
}

export default Sidebar
