import {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Pane, Button, ChevronRightIcon, CrossIcon, ChevronLeftIcon} from 'evergreen-ui'

import useWindowSize from '@/hooks/window-size'
import BalDataContext from '@/contexts/bal-data'

function Sidebar({isHidden, size, onToggle, top, ...props}) {
  const {innerWidth} = useWindowSize()
  const {setEditingId, isEditing, setIsEditing} = useContext(BalDataContext)

  const handleClick = () => {
    if (isEditing) {
      setEditingId(null)
      setIsEditing(false)
    } else {
      onToggle(!isHidden)
    }
  }

  useEffect(() => {
    if (isEditing && isHidden) { // Force opening sidebar when editing
      onToggle(false)
    }
  }, [isEditing, isHidden, onToggle])

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
            height={50}
            paddingX={8}
            elevation={0}
            borderRadius={0}
            onClick={handleClick}
          >
            {isHidden ? (
              <ChevronRightIcon />
            ) : (isEditing ? (
              <CrossIcon />
            ) : (
              <ChevronLeftIcon />
            ))}
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
  onToggle: PropTypes.func.isRequired,
  top: PropTypes.number.isRequired
}

Sidebar.defaultProps = {
  isHidden: false
}

export default Sidebar
