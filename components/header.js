import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Popover, Menu, IconButton, Position} from 'evergreen-ui'

import Breadcrumbs from './breadcrumbs'

const Header = React.memo(({baseLocale, commune, voie}) => {
  return (
    <Pane
      position='fixed'
      top={0}
      left={0}
      height={40}
      width='100%'
      background='tint1'
      elevation={1}
      zIndex={3}
      display='flex'
      paddingY={8}
      paddingX={16}
    >
      <Breadcrumbs baseLocale={baseLocale} commune={commune} voie={voie} />

      <Popover
        position={Position.BOTTOM_RIGHT}
        content={
          <Menu>
            <Menu.Group>
              <Menu.Item disabled icon='edit'>
                Todo…
              </Menu.Item>
            </Menu.Group>
          </Menu>
        }
      >
        <IconButton
          height={24}
          icon='menu'
          appearance='minimal'
          marginLeft='auto'
        />
      </Popover>
    </Pane>
  )
})

Header.propTypes = {
  baseLocale: PropTypes.object.isRequired,
  commune: PropTypes.object,
  voie: PropTypes.object
}

export default Header
