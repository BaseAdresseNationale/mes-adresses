import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Popover, Menu, IconButton, Position} from 'evergreen-ui'

import {downloadBaseLocaleCsv} from '../lib/bal-api'

import useWindowSize from '../hooks/window-size'

import Breadcrumbs from './breadcrumbs'

const Header = React.memo(({baseLocale, commune, voie, size, isSidebarHidden, onToggle}) => {
  const {innerWidth} = useWindowSize()

  const onDownload = useCallback(async () => {
    const res = await downloadBaseLocaleCsv(baseLocale._id)
    const blob = await res.blob()

    window.open(URL.createObjectURL(blob))
  }, [baseLocale._id])

  return (
    <Pane
      position='fixed'
      top={0}
      left={0}
      height={40}
      width='100%'
      background='tint1'
      elevation={0}
      zIndex={3}
      display='flex'
      padding={8}
    >
      {innerWidth && innerWidth < size && (
        <IconButton
          height={24}
          marginRight={8}
          icon='menu'
          isActive={!isSidebarHidden}
          appearance='minimal'
          onClick={onToggle}
        />
      )}

      <Breadcrumbs
        baseLocale={baseLocale}
        commune={commune}
        voie={voie}
        marginRight={8}
      />

      <Pane marginLeft='auto' display='flex'>
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item icon='download' onSelect={onDownload}>
                  Télécharger le fichier CSV
                </Menu.Item>
              </Menu.Group>
            </Menu>
          }
        >
          <IconButton
            height={24}
            icon='cog'
            appearance='minimal'
          />
        </Popover>
      </Pane>
    </Pane>
  )
})

Header.propTypes = {
  baseLocale: PropTypes.object.isRequired,
  commune: PropTypes.object,
  voie: PropTypes.object
}

export default Header
