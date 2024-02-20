import { useContext } from "react";
import {
  Popover,
  Menu,
  Position,
  Button,
  DownloadIcon,
  TrashIcon,
  MenuIcon,
  CogIcon,
} from "evergreen-ui";

import DrawerContext, { DrawerDisplayedEnum } from "@/contexts/drawer";

interface SettingsMenuProps {
  isAdmin: boolean;
}

function SettingsMenu({ isAdmin }: SettingsMenuProps) {
  const { setDrawerDisplayed } = useContext(DrawerContext);

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item
              icon={DownloadIcon}
              onSelect={() => setDrawerDisplayed(DrawerDisplayedEnum.DOWNLOAD)}
            >
              Téléchargements
            </Menu.Item>
            <Menu.Item
              icon={CogIcon}
              onSelect={() => setDrawerDisplayed(DrawerDisplayedEnum.SETTING)}
            >
              Paramètres
            </Menu.Item>
            {isAdmin && (
              <Menu.Item
                icon={TrashIcon}
                onSelect={() => setDrawerDisplayed(DrawerDisplayedEnum.TRASH)}
              >
                Voir la corbeille
              </Menu.Item>
            )}
          </Menu.Group>
        </Menu>
      }
    >
      <Button
        height={24}
        iconBefore={MenuIcon}
        appearance="minimal"
        marginRight={16}
      >
        Menu
      </Button>
    </Popover>
  );
}

export default SettingsMenu;
