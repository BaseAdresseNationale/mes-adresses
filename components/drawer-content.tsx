import { useContext, useState } from "react";
import {
  Button,
  CrossIcon,
  Pane,
  SideSheet,
  Tab,
  Tablist,
  Text,
} from "evergreen-ui";

import DrawerContext from "@/contexts/drawer";
import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import Downloads from "@/components/downloads";
import Settings from "@/components/settings";
import Trash from "@/components/trash";
import Share from "@/components/share/share";
import LayoutContext from "@/contexts/layout";

function DrawerContent() {
  const { isMobile } = useContext(LayoutContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { drawerDisplayed, setDrawerDisplayed } = useContext(DrawerContext);
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);

  const tabs = [
    {
      label: "Paramètres",
      key: "settings",
      content: <Settings baseLocale={baseLocale} />,
    },
    {
      label: "Téléchargements",
      key: "downloads",
      content: <Downloads baseLocaleId={baseLocale.id} />,
    },

    {
      label: "Corbeille",
      key: "trash",
      content: <Trash />,
    },
    ...(token
      ? [
          {
            label: "Accès",
            key: "share",
            content: <Share baseLocale={baseLocale} token={token} />,
          },
        ]
      : []),
  ];

  return (
    <SideSheet
      isShown={Boolean(drawerDisplayed)}
      onCloseComplete={() => setDrawerDisplayed(null)}
      {...(isMobile && { width: "100%" })}
    >
      <Pane
        flexShrink={0}
        elevation={0}
        background="white"
        padding={16}
        display="flex"
        alignItems="center"
        minHeight={64}
      >
        <Pane display="flex" alignItems="center">
          <Tablist>
            {tabs.map(({ label }, index) => (
              <Tab
                key={label}
                isSelected={selectedIndex === index}
                onSelect={() => setSelectedIndex(index)}
                position="relative"
              >
                {label}
              </Tab>
            ))}
          </Tablist>
        </Pane>
      </Pane>

      {tabs[selectedIndex] && tabs[selectedIndex].content}

      {isMobile && (
        <Button
          onClick={() => setDrawerDisplayed(false)}
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
