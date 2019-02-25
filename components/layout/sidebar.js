import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, Icon} from 'evergreen-ui'

function Sidebar(props) {
  const [isOpen, setIsOpen] = useState(true)
  const width = isOpen ? 500 : 0

  const onToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Pane
      position='fixed'
      height='100vh'
      width={width}
      maxWidth='100vw'
      left={0}
      right='auto'
    >
      <Button
        position='fixed'
        paddingX={8}
        height={50}
        left={width}
        border='muted'
        top={15}
        elevation={0}
        borderRadius={0}
        onClick={onToggle}
      >
        <Icon
          icon={isOpen ? 'chevron-left' : 'chevron-right'}
        />
      </Button>

      <Pane
        height='100vh'
        maxHeight='100vh'
        width={width}
        flex={1}
        overflow='hidden'
        {...props}
      />
    </Pane>
  )
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired
}

export default Sidebar
