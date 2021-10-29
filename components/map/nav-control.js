import React from 'react'
import PropTypes from 'prop-types'
import {NavigationControl} from 'react-map-gl'
import {Pane} from 'evergreen-ui'

function NavControl({onViewportChange, ...props}) {
  return (
    <Pane
      position='absolute'
      top={16}
      right={46}
      zIndex={2}
    >
      <NavigationControl
        showCompass={false}
        onViewportChange={onViewportChange}
        {...props}
      />
    </Pane>
  )
}

NavControl.propTypes = {
  onViewportChange: PropTypes.func.isRequired
}

export default NavControl
