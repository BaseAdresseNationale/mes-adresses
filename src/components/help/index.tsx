"use client";

import { useContext } from "react";
import {
  Pane,
  SideSheet,
  Paragraph,
  Heading,
  Tablist,
  Tab,
  Link,
  Button,
  CrossIcon,
} from "evergreen-ui";

import HelpContext from "@/contexts/help";

import HelpTabs, { TABS } from "@/components/help/help-tabs";
import LayoutContext from "@/contexts/layout";

function Help() {
  const { isMobile } = useContext(LayoutContext);
  const { showHelp, setShowHelp, selectedIndex, setSelectedIndex } =
    useContext(HelpContext);

  return (
    <SideSheet
      isShown={showHelp}
      containerProps={{
        display: "flex",
        flex: "1",
        flexDirection: "column",
      }}
      onCloseComplete={() => setShowHelp(false)}
      {...(isMobile && { width: "100%" })}
    >
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
        <Pane padding={16} borderBottom="muted">
          <Heading size={600}>Besoin d’aide ?</Heading>
        </Pane>
        <Pane display="flex" padding={8}>
          <Tablist>
            {TABS.map((tab, index) => (
              <Tab
                key={tab}
                isSelected={selectedIndex === index}
                onSelect={() => setSelectedIndex(index)}
              >
                {tab}
              </Tab>
            ))}
          </Tablist>
        </Pane>
      </Pane>

      <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
        <HelpTabs tab={selectedIndex} />
      </Pane>

      <Pane padding={16} background="tint2" elevation={1}>
        <Heading>Vous n’avez pas trouvé la solution à votre problème ?</Heading>
        <Paragraph>
          <Link target="_blank" href="https://adresse.data.gouv.fr/guides">
            Consultez les guides de l’adressage
          </Link>
        </Paragraph>
        <Paragraph>ou</Paragraph>
        <Paragraph>
          Contactez nous sur{" "}
          <a href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</a>
        </Paragraph>
      </Pane>
      {isMobile && (
        <Button
          onClick={() => setShowHelp(false)}
          position="absolute"
          top="15px"
          right="20px"
          border="none"
          zIndex={1}
        >
          <CrossIcon />
        </Button>
      )}
    </SideSheet>
  );
}

export default Help;
