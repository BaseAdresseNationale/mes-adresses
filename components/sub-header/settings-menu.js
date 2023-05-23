import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Popover, Menu, Position, Button, CogIcon, DownloadIcon, TrashIcon, SettingsIcon} from 'evergreen-ui'

import SettingsContext from '@/contexts/settings'

function SettingsMenu({isAdmin, csvBalUrl, csvVoiesUrl, setIsTrashOpen}) {
  const {setSettingsDisplayed} = useContext(SettingsContext)

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item icon={DownloadIcon} is='a' href={csvBalUrl} color='inherit' textDecoration='none'>
              Télécharger Base Locale CSV
            </Menu.Item>
            <Menu.Item icon={DownloadIcon} is='a' href={csvVoiesUrl} color='inherit' textDecoration='none'>
              Télécharger liste des voies CSV
            </Menu.Item>
          </Menu.Group>
          {isAdmin && (
            <>
              <Menu.Divider />
              <Menu.Group>
                <Menu.Item icon={TrashIcon} onSelect={() => setIsTrashOpen(true)}>
                  Voir la corbeille
                </Menu.Item>
              </Menu.Group>
            </>)}
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item icon={SettingsIcon} onSelect={() => setSettingsDisplayed('user-settings')}>
              Préférences utilisateur
            </Menu.Item>
            {isAdmin && (
              <Menu.Item icon={CogIcon} onSelect={() => setSettingsDisplayed('bal-settings')}>
                Gérer les droits
              </Menu.Item>
            )}
          </Menu.Group>

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
  )
}

SettingsMenu.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  csvBalUrl: PropTypes.string.isRequired,
  csvVoiesUrl: PropTypes.string.isRequired,
  setIsTrashOpen: PropTypes.func.isRequired
}

export default SettingsMenu
