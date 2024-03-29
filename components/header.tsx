import { useContext } from "react";
import NextLink from "next/link";
import Image from "next/legacy/image";
import { Pane, Button, HelpIcon, BookIcon, VideoIcon } from "evergreen-ui";

import HelpContext from "@/contexts/help";
import { PEERTUBE_LINK } from "@/components/help/video-container";
import useWindowSize from "@/hooks/useWindowSize";

function Header() {
  const { isMobile } = useWindowSize();
  const { showHelp, setShowHelp } = useContext(HelpContext);

  return (
    <Pane
      borderBottom
      padding={16}
      backgroundColor="white"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexShrink="0"
      width="100%"
      maxHeight={76}
    >
      <Pane cursor="pointer">
        <NextLink href="/">
          <Image
            className="img"
            height="34"
            width="304"
            src="/static/images/mes-adresses.svg"
            alt="Page d’accueil du site mes-adresses.data.gouv.fr"
          />
        </NextLink>
      </Pane>
      {!isMobile && (
        <Pane display="flex" justifyContent="space-around" alignItems="center">
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
            href={PEERTUBE_LINK}
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
      )}
    </Pane>
  );
}

export default Header;
