import React, {useContext, useMemo} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import NextLink from 'next/link'
import getConfig from 'next/config'
import {Pane, Popover, Menu, IconButton, Button, Position, Tooltip} from 'evergreen-ui'
import {css} from 'glamor'

import {getBaseLocaleCsvUrl} from '../lib/bal-api'

import TokenContext from '../contexts/token'
import HelpContext from '../contexts/help'

import useWindowSize from '../hooks/window-size'

import Breadcrumbs from './breadcrumbs'

const {publicRuntimeConfig} = getConfig()
const ADRESSE_URL = publicRuntimeConfig.ADRESSE_URL || 'https://adresse.data.gouv.fr'

const Header = React.memo(({baseLocale, commune, voie, layout, isSidebarHidden, onToggle}) => {
  const {showHelp, setShowHelp} = useContext(HelpContext)

  const {innerWidth} = useWindowSize()
  const {token} = useContext(TokenContext)

  const csvUrl = getBaseLocaleCsvUrl(baseLocale._id)

  const editTip = useMemo(() => css({
    '@media (max-width: 700px)': {
      marginLeft: -10,

      '& > span': {
        display: 'none'
      }
    }
  }), [])

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

      <IconButton
        height={24}
        marginRight={8}
        icon='home'
        appearance='minimal'
        onClick={() => Router.push('/')}
      />

      <Breadcrumbs
        baseLocale={baseLocale}
        commune={commune}
        voie={voie}
        marginRight={8}
      />

      <Pane marginLeft='auto' display='flex'>
        {token ? (
          <NextLink href={`${ADRESSE_URL}/bases-locales/publication?url=${encodeURIComponent(csvUrl)}`}>
            <a style={{textDecoration: 'none'}}><Button marginRight={8} height={24} appearance='primary'>Publier</Button></a>
          </NextLink>
        ) : (
          <Tooltip
            content='Vous n’êtes pas identifié comme administrateur de cette base adresse locale, vous ne pouvez donc pas l’éditer.'
            position={Position.BOTTOM_RIGHT}
          >
            <Button height={24} marginRight={8} appearance='primary' intent='danger' iconBefore='edit'>
              <div className={editTip}><span>Édition impossible</span></div>
            </Button>
          </Tooltip>
        )}

        <IconButton
          height={24}
          icon='help'
          appearance='minimal'
          onClick={() => setShowHelp(!showHelp)}
        />

        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <Menu>
              <Menu.Group>
                <NextLink href={csvUrl}>
                  <Menu.Item icon='download' is='a' href={csvUrl} color='inherit' textDecoration='none'>
                    Télécharger au format CSV
                  </Menu.Item>
                </NextLink>
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
  voie: PropTypes.object,
  layout: PropTypes.oneOf(['fullscreen', 'sidebar']).isRequired,
  isSidebarHidden: PropTypes.bool,
  onToggle: PropTypes.func.isRequired
}

Header.defaultProps = {
  commune: null,
  voie: null,
  isSidebarHidden: false
}

export default Header
