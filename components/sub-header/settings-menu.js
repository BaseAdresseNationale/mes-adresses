import {useContext} from 'react'
import PropTypes from 'prop-types'
import {Popover, Menu, Position, Button, DownloadIcon, TrashIcon, MenuIcon, CogIcon} from 'evergreen-ui'

import DrawerContext from '@/contexts/drawer'

function SettingsMenu({isAdmin}) {
  const {setDrawerDisplayed} = useContext(DrawerContext)

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item icon={DownloadIcon} onSelect={() => setDrawerDisplayed('downloads')}>
              Téléchargements
            </Menu.Item>
            <Menu.Item icon={CogIcon} onSelect={() => setDrawerDisplayed('settings')}>
              Paramètres
            </Menu.Item>
            {isAdmin && (<Menu.Item icon={TrashIcon} onSelect={() => setDrawerDisplayed('trash')}>
              Voir la corbeille
            </Menu.Item>)}
          </Menu.Group>
        </Menu>
      }
    >
      <Button
        height={24}
        iconBefore={MenuIcon}
        appearance='minimal'
        marginRight={16}
      >
        Menu
      </Button>
    </Popover>
  )
}

SettingsMenu.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
}

export default SettingsMenu
