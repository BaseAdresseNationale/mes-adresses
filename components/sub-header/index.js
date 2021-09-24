import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import NextLink from 'next/link'
import {Pane, Popover, Menu, Position, Button, CogIcon, DownloadIcon} from 'evergreen-ui'

import {getBaseLocaleCsvUrl, updateBaseLocale} from '../../lib/bal-api'

import BalDataContext from '../../contexts/bal-data'
import TokenContext from '../../contexts/token'

import useError from '../../hooks/error'

import Breadcrumbs from '../breadcrumbs'

import Publication from './publication'
import DemoWarning from './demo-warning'
import Settings from './settings'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'https://adresse.data.gouv.fr'

const SubHeader = React.memo(({nomCommune, voie, toponyme}) => {
  const {baseLocale, commune, reloadBaseLocale} = useContext(BalDataContext)
  const {token} = useContext(TokenContext)

  const [isSettingDislayed, setIsSettingDislayed] = useState(false)
  const [setError] = useError(null)

  const csvUrl = getBaseLocaleCsvUrl(baseLocale._id)

  const toggleSettings = () => {
    setIsSettingDislayed(!isSettingDislayed)
  }

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

        <Breadcrumbs
          baseLocale={baseLocale}
          commune={{...commune, nom: nomCommune}}
          voie={voie}
          toponyme={toponyme}
          marginLeft={8}
        />

        <Pane marginLeft='auto' display='flex'>
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
                    <Menu.Item icon={CogIcon} onSelect={toggleSettings}>
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
              isBALCertified={commune.nbNumeros === commune.nbNumerosCertifies}
              status={baseLocale.status}
              onChangeStatus={handleChangeStatus}
              onPublish={handlePublication}
            />)}
        </Pane>
      </Pane>

      <Settings
        isShow={isSettingDislayed}
        handleClose={() => setIsSettingDislayed(false)}
      />

      {baseLocale.status === 'demo' && (
        <DemoWarning baseLocale={baseLocale} token={token} />
      )}
    </>
  )
})

SubHeader.propTypes = {
  nomCommune: PropTypes.string.isRequired,
  voie: PropTypes.object,
  toponyme: PropTypes.object
}

SubHeader.defaultProps = {
  voie: null,
  toponyme: null
}

export default SubHeader
