import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import {Pane, Popover, Menu, IconButton, Position, Button, MenuIcon, HelpIcon, CogIcon, DownloadIcon} from 'evergreen-ui'

import {getBaseLocaleCsvUrl, updateBaseLocale} from '../../lib/bal-api'

import BalDataContext from '../../contexts/bal-data'
import TokenContext from '../../contexts/token'
import HelpContext from '../../contexts/help'
import SettingsContext from '../../contexts/settings'

import useError from '../../hooks/error'
import useWindowSize from '../../hooks/window-size'

import Breadcrumbs from '../breadcrumbs'

import Publication from './publication'
import DemoWarning from './demo-warning'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'https://adresse.data.gouv.fr'

const SubHeader = React.memo(({commune, voie, toponyme, layout, isSidebarHidden, onToggle}) => {
  const {baseLocale, reloadBaseLocale} = useContext(BalDataContext)
  const {showHelp, setShowHelp} = useContext(HelpContext)
  const {showSettings, setShowSettings} = useContext(SettingsContext)
  const {token} = useContext(TokenContext)

  const [setError] = useError(null)
  const {innerWidth} = useWindowSize()

  const csvUrl = getBaseLocaleCsvUrl(baseLocale._id)

  const handleChangeStatus = async () => {
    try {
      const newStatus = baseLocale.status === 'draft' ? 'ready-to-publish' : 'draft'
      await updateBaseLocale(baseLocale._id, {status: newStatus}, token)

      await reloadBaseLocale()
    } catch (error) {
      setError(error.message)
    }
  }

  const handlePublication = async () => {
    try {
      await updateBaseLocale(baseLocale._id, {status: 'ready-to-publish'}, token)
      window.location.href = `${ADRESSE_URL}/bases-locales/publication?url=${encodeURIComponent(csvUrl)}`
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <>
      <Pane
        position='fixed'
        top={76}
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
            icon={MenuIcon}
            isActive={!isSidebarHidden}
            appearance='minimal'
            onClick={onToggle}
          />
        )}

        <Breadcrumbs
          baseLocale={baseLocale}
          commune={commune}
          voie={voie}
          toponyme={toponyme}
          marginLeft={8}
        />

        <Pane marginLeft='auto' display='flex'>

          <Button
            height={24}
            iconAfter={HelpIcon}
            appearance='minimal'
            marginRight={16}
            onClick={() => setShowHelp(!showHelp)}
          >
            Besoin d’aide
          </Button>

          <Popover
            position={Position.BOTTOM_RIGHT}
            content={
              <Menu>
                <Menu.Group>
                  <NextLink href={csvUrl}>
                    <Menu.Item icon={DownloadIcon} is='a' href={csvUrl} color='inherit' textDecoration='none'>
                      Télécharger au format CSV
                    </Menu.Item>
                  </NextLink>
                </Menu.Group>
                {token && (
                <>
                  <Menu.Divider />
                  <Menu.Group>
                    <Menu.Item icon={CogIcon} onSelect={() => setShowSettings(!showSettings)}>
                      Paramètres
                    </Menu.Item>
                  </Menu.Group>
                </>
                )}
              </Menu>
            }
          >
            <Button
              height={24}
              iconAfter={CogIcon}
              appearance='minimal'
              marginRight={16}
            >
              Paramètres
            </Button>
          </Popover>

          {baseLocale.status !== 'demo' && (
            <Publication
              border
              token={token}
              baseLocale={baseLocale}
              commune={commune}
              status={baseLocale.published ? 'published' : baseLocale.status}
              onChangeStatus={handleChangeStatus}
              onPublish={handlePublication}
            />)}
        </Pane>
      </Pane>
      {baseLocale.status === 'demo' && (
        <DemoWarning baseLocale={baseLocale} token={token} />
      )}
    </>
  )
})

SubHeader.propTypes = {
  commune: PropTypes.object,
  voie: PropTypes.object,
  toponyme: PropTypes.object,
  layout: PropTypes.oneOf(['fullscreen', 'sidebar']).isRequired,
  isSidebarHidden: PropTypes.bool,
  onToggle: PropTypes.func.isRequired
}

SubHeader.defaultProps = {
  commune: null,
  voie: null,
  toponyme: null,
  isSidebarHidden: false
}

export default SubHeader
