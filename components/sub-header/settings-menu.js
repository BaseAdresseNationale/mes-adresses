import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Popover, Menu, Position, Button, CogIcon, DownloadIcon, TrashIcon} from 'evergreen-ui'

import SettingsContext from '@/contexts/settings'

function SettingsMenu({isAdmin, csvUrl, setIsTrashOpen}) {
  const {isSettingsDisplayed, setIsSettingsDisplayed} = useContext(SettingsContext)

  if (!isAdmin) {
    return (
      <Button
        is='a'
        href={csvUrl}
        height={24}
        iconAfter={DownloadIcon}
        appearance='minimal'
        marginRight={16}
      >
        Télécharger au format CSV
      </Button>
    )
  }

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item icon={TrashIcon} onSelect={() => setIsTrashOpen(true)}>
              Voir la corbeille
            </Menu.Item>
          </Menu.Group>
          <Menu.Group>
            <Menu.Item icon={DownloadIcon} is='a' href={csvUrl} color='inherit' textDecoration='none'>
              Télécharger au format CSV
            </Menu.Item>
          </Menu.Group>
          {isAdmin && (
            <>
              <Menu.Divider />
              <Menu.Group>
                <Menu.Item icon={CogIcon} onSelect={() => setIsSettingsDisplayed(!isSettingsDisplayed)}>
                  Gérer les droits
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
  )
}

SettingsMenu.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  csvUrl: PropTypes.string.isRequired,
  setIsTrashOpen: PropTypes.func.isRequired
}

export default SettingsMenu
