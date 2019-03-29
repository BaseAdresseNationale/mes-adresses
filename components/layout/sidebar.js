import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Icon} from 'evergreen-ui'

import useWindowSize from '../../hooks/window-size'

function Sidebar({isHidden, top, size, onToggle, ...props}) {
  const {innerWidth} = useWindowSize()

  return (
    <Pane
      position='fixed'
      width={size}
      transition='left 0.3s'
      maxWidth='100vw'
      left={isHidden ? -size : 0}
      right='auto'
      top={top}
      bottom={0}
      zIndex={2}
    >
      {innerWidth > 800 && (
        <Pane
          background='white'
          position='absolute'
          left={size}
          top={15}
        >
          <Button
            border='muted'
            height={50}
            paddingX={8}
            elevation={0}
            borderRadius={0}
            onClick={onToggle}
          >
            <Icon
              icon={isHidden ? 'chevron-right' : 'chevron-left'}
            />
          </Button>
        </Pane>
      )}

      <Pane
        height='100%'
        maxHeight='100%'
        width={size}
        maxWidth='100%'
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
  top: PropTypes.number,
  onToggle: PropTypes.func.isRequired
}

Sidebar.defaultProps = {
  isHidden: false,
  top: 0
}

export default Sidebar
