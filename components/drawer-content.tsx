import { useContext, useState } from "react";
import { Button, CrossIcon, Pane, SideSheet, Tab, Tablist } from "evergreen-ui";

import DrawerContext from "@/contexts/drawer";
import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import Downloads from "@/components/downloads";
import Settings from "@/components/settings";
import Trash from "@/components/trash";
import LayoutContext from "@/contexts/layout";
import { BaseLocale } from "@/lib/openapi-api-bal";

function DrawerContent() {
  const { isMobile } = useContext(LayoutContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { drawerDisplayed, setDrawerDisplayed } = useContext(DrawerContext);
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);

  const isAdmin = Boolean(token);

  const tabs = [
    ...(baseLocale.status !== BaseLocale.status.DEMO && isAdmin
      ? [
          {
            label: "Paramètres",
            key: "settings",
            content: <Settings baseLocale={baseLocale} token={token} />,
          },
        ]
      : []),
    {
      label: "Téléchargements",
      key: "downloads",
      content: <Downloads baseLocale={baseLocale} />,
    },
    ...(isAdmin
      ? [
          {
            label: "Corbeille",
            key: "trash",
            content: <Trash />,
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
