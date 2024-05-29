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
import LayoutContext from "@/contexts/layout";

interface SettingsMenuProps {
  isAdmin: boolean;
}

function SettingsMenu({ isAdmin }: SettingsMenuProps) {
  const { isMobile } = useContext(LayoutContext);
  const { setDrawerDisplayed } = useContext(DrawerContext);

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu {...(isMobile ? { marginLeft: 10 } : {})}>
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
        appearance="minimal"
        {...(!isMobile && { iconAfter: MenuIcon, marginRight: 16, height: 24 })}
      >
        {isMobile ? <MenuIcon /> : "Menu"}
      </Button>
    </Popover>
  );
}

export default SettingsMenu;
