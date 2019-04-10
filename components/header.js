import React, {useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import getConfig from 'next/config'
import {Pane, Popover, Menu, IconButton, Button, Position} from 'evergreen-ui'

import {downloadBaseLocaleCsv} from '../lib/bal-api'

import TokenContext from '../contexts/token'

import useWindowSize from '../hooks/window-size'

import Breadcrumbs from './breadcrumbs'

const {publicRuntimeConfig: {
  ADRESSE_URL,
  BAL_API_URL
}} = getConfig()

const Header = React.memo(({baseLocale, commune, voie, layout, isSidebarHidden, onToggle}) => {
  const {innerWidth} = useWindowSize()
  const {token} = useContext(TokenContext)

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
      {layout !== 'fullscreen' && innerWidth && innerWidth < 800 && (
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
        <NextLink href={`${ADRESSE_URL}/bases-locales/publication?url=${BAL_API_URL}/bases-locales/${baseLocale._id}/csv`}>
          <a><Button height={24} appearance='primary'>Publier</Button></a>
        </NextLink>

        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Menu>
              <Menu.Group>
                <Menu.Item icon='download' onSelect={onDownload}>
                  Télécharger au format CSV
                </Menu.Item>
              </Menu.Group>
              {token && (
                <>
                  <Menu.Divider />
                  <Menu.Group>
                    <NextLink href={`/bal/settings?balId=${baseLocale._id}`} as={`/bal/${baseLocale._id}/settings`}>
                      <Menu.Item icon='cog' is='a' href={`/bal/${baseLocale._id}/settings`} color='inherit' textDecoration='none'>
                        Paramètres
                      </Menu.Item>
                    </NextLink>
                  </Menu.Group>
                </>
              )}
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
