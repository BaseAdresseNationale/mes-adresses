import { useContext } from "react";
import NextLink from "next/link";
import Image from "next/legacy/image";
import { Pane, Button, HelpIcon, BookIcon, VideoIcon } from "evergreen-ui";

import HelpContext from "@/contexts/help";
import { PEERTUBE_LINK } from "@/components/help/video-container";
import { MobileHelpMenu } from "./mobile-layout/mobile-help-menu";
import LayoutContext from "@/contexts/layout";

function Header() {
  const { isMobile } = useContext(LayoutContext);
  const { showHelp, setShowHelp } = useContext(HelpContext);

  return (
    <Pane
      is="header"
      aria-label="mes-adresses-header"
      borderBottom
      backgroundColor="white"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexShrink="0"
      width="100%"
      height={76}
      paddingLeft={16}
      paddingRight={16}
    >
      <Pane cursor="pointer">
        <NextLink href="/">
          <Image
            className="img"
            height={34}
            width={isMobile ? 200 : 304}
            src="/static/images/mes-adresses.svg"
            alt="Page d’accueil du site mes-adresses.data.gouv.fr"
          />
        </NextLink>
      </Pane>
      <Pane id="header-menu-wrapper" paddingTop={16} paddingBottom={16}>
        {!isMobile ? (
          <Pane
            display="flex"
            justifyContent="space-around"
            alignItems="center"
          >
            <Button
              appearance="minimal"
              marginRight="12px"
              minHeight="55px"
              iconAfter={HelpIcon}
              onClick={() => setShowHelp(!showHelp)}
            >
              Besoin d’aide
            </Button>

            <Button
              is="a"
              href={`${PEERTUBE_LINK}/w/p/cm6YcSnDdztzRjKTH3vNFn`}
              target="_blank"
              appearance="minimal"
              marginRight="12px"
              minHeight="55px"
              iconAfter={VideoIcon}
            >
              Tutoriels vidéos
            </Button>

            <Button
              is="a"
              href="https://adresse.data.gouv.fr/guides"
              target="_blank"
              appearance="minimal"
              marginRight="12px"
              minHeight="55px"
              iconAfter={BookIcon}
            >
              Guides de l’adressage
            </Button>
          </Pane>
        ) : (
          <MobileHelpMenu />
        )}
      </Pane>
    </Pane>
  );
}

export default Header;
