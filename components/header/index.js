import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import NextLink from 'next/link'
import getConfig from 'next/config'
import {Pane, Popover, Menu, IconButton, Position} from 'evergreen-ui'

import {getBaseLocaleCsvUrl, updateBaseLocale} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import HelpContext from '../../contexts/help'

import useError from '../../hooks/error'
import useWindowSize from '../../hooks/window-size'

import Breadcrumbs from '../breadcrumbs'

import Publication from './publication'

const {publicRuntimeConfig} = getConfig()
const ADRESSE_URL = publicRuntimeConfig.ADRESSE_URL || 'https://adresse.data.gouv.fr'

const Header = React.memo(({baseLocale, commune, voie, layout, isSidebarHidden, refreshBaseLocale, onToggle}) => {
  const {showHelp, setShowHelp} = useContext(HelpContext)
  const [setError] = useError(null)

  const {innerWidth} = useWindowSize()
  const {token} = useContext(TokenContext)

  const csvUrl = getBaseLocaleCsvUrl(baseLocale._id)

  const handleChangeStatus = async () => {
    try {
      const newStatus = baseLocale.status === 'draft' ? 'ready-to-publish' : 'draft'
      await updateBaseLocale(baseLocale._id, {status: newStatus}, token)

      refreshBaseLocale()
    } catch (error) {
      setError(error.message)
    }
  }

  const handlePublication = async () => {
    try {
      await updateBaseLocale(baseLocale._id, {status: 'ready-to-publish'}, token)
      Router.push(`${ADRESSE_URL}/bases-locales/publication?url=${encodeURIComponent(csvUrl)}`)
    } catch (error) {
      setError(error.message)
    }
  }

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
        <Publication
          token={token}
          status={baseLocale.published ? 'published' : baseLocale.status}
          onChangeStatus={handleChangeStatus}
          onPublish={handlePublication}
        />

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
  refreshBaseLocale: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired
}

Header.defaultProps = {
  commune: null,
  voie: null,
  isSidebarHidden: false
}

export default Header
