import { useContext } from "react";
import { SideSheet } from "evergreen-ui";

import DrawerContext, { DrawerDisplayedEnum } from "@/contexts/drawer";
import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import Downloads from "@/components/downloads";
import Settings from "@/components/settings";
import Trash from "@/components/trash";

function DrawerContent() {
  const { drawerDisplayed, setDrawerDisplayed } = useContext(DrawerContext);
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);

  return (
    <SideSheet
      isShown={Boolean(drawerDisplayed)}
      onCloseComplete={() => setDrawerDisplayed(null)}
    >
      {drawerDisplayed === DrawerDisplayedEnum.DOWNLOAD && (
        <Downloads baseLocaleId={baseLocale._id} />
      )}
      {drawerDisplayed === DrawerDisplayedEnum.SETTING && (
        <Settings baseLocale={baseLocale} isAdmin={isAdmin} />
      )}
      {drawerDisplayed === DrawerDisplayedEnum.TRASH && <Trash />}
    </SideSheet>
  );
}

export default DrawerContent;
