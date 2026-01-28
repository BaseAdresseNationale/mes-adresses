import { useContext } from "react";
import { Button, MenuIcon } from "evergreen-ui";

import DrawerContext from "@/contexts/drawer";
import LayoutContext from "@/contexts/layout";

function SettingsMenu() {
  const { isMobile } = useContext(LayoutContext);
  const { setDrawerDisplayed } = useContext(DrawerContext);

  return (
    <Button
      appearance="minimal"
      onClick={() => setDrawerDisplayed(true)}
      {...(!isMobile && { iconAfter: MenuIcon, marginRight: 16, height: 24 })}
    >
      {isMobile ? <MenuIcon /> : "Menu"}
    </Button>
  );
}

export default SettingsMenu;
