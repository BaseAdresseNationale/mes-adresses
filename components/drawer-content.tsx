import { useContext } from "react";
import { Button, CrossIcon, SideSheet } from "evergreen-ui";

import DrawerContext, { DrawerDisplayedEnum } from "@/contexts/drawer";
import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import Downloads from "@/components/downloads";
import Settings from "@/components/settings";
import Trash from "@/components/trash";
import Share from "@/components/share/share";
import LayoutContext from "@/contexts/layout";

function DrawerContent() {
  const { isMobile } = useContext(LayoutContext);
  const { drawerDisplayed, setDrawerDisplayed } = useContext(DrawerContext);
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);

  return (
    <SideSheet
      isShown={Boolean(drawerDisplayed)}
      onCloseComplete={() => setDrawerDisplayed(null)}
      {...(isMobile && { width: "100%" })}
    >
      {drawerDisplayed === DrawerDisplayedEnum.DOWNLOAD && (
        <Downloads baseLocale={baseLocale} />
      )}
      {drawerDisplayed === DrawerDisplayedEnum.SETTING && (
        <Settings baseLocale={baseLocale} />
      )}
      {drawerDisplayed === DrawerDisplayedEnum.TRASH && <Trash />}
      {drawerDisplayed === DrawerDisplayedEnum.SHARE && token && (
        <Share baseLocale={baseLocale} token={token} />
      )}

      {isMobile && (
        <Button
          onClick={() => setDrawerDisplayed(null)}
          position="absolute"
          top="15px"
          right="20px"
          border="none"
        >
          <CrossIcon />
        </Button>
      )}
    </SideSheet>
  );
}

export default DrawerContent;
