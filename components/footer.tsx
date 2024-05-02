import { useContext, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Pane,
  Heading,
  Button,
  Paragraph,
  ManualIcon,
  WalkIcon,
  IconComponent,
} from "evergreen-ui";

import HelpContext from "@/contexts/help";

import useHelp from "@/hooks/help";
import useWindowSize from "@/hooks/useWindowSize";

interface FooterLinkProps {
  title: string;
  description: string;
  icon: IconComponent;
  link?: string;
  onClick?: () => void;
}

function FooterLink({
  title,
  description,
  link,
  icon,
  onClick,
}: FooterLinkProps) {
  return (
    <Pane display="flex" flexDirection="column" alignItems="center">
      {link ? (
        <Button
          iconBefore={icon}
          is="a"
          appearance="minimal"
          height={30}
          href={link}
          target="_blank"
          fontSize="0.8em"
        >
          {title}
        </Button>
      ) : (
        <Button
          iconBefore={icon}
          appearance="minimal"
          height={30}
          fontSize="0.8em"
          onClick={onClick}
        >
          {title}
        </Button>
      )}

      <Paragraph marginTop={4} textAlign="center" fontStyle="italic">
        <small>{description}</small>
      </Paragraph>
    </Pane>
  );
}

function Footer() {
  const { showHelp, setShowHelp, setSelectedIndex } = useContext(HelpContext);
  const { isMobile } = useWindowSize();

  useHelp(0);

  const handleHelp = useCallback(() => {
    setSelectedIndex(0);
    setShowHelp(!showHelp);
  }, [setSelectedIndex, setShowHelp, showHelp]);

  return (
    <div>
      <Pane bottom={0} background="tint1" padding={16} elevation={1}>
        <Pane>
          <Heading textAlign="center" marginBottom={12} size={600}>
            Besoin d’aide ?
          </Heading>
        </Pane>
        <Pane
          display="grid"
          justifyContent="space-between"
          alignItems="center"
          {...(isMobile ? {} : { gridTemplateColumns: "1fr 1fr 1fr" })}
        >
          <FooterLink
            title="Guides de l’adressage"
            icon={ManualIcon}
            description="Pour vous accompagner dans la gestion des adresses de votre commune"
            link="https://adresse.data.gouv.fr/guides"
          />
          <FooterLink
            title="Guide interactif"
            icon={ManualIcon}
            description="Le manuel de l’éditeur toujours à porté de main"
            onClick={handleHelp}
          />
          <FooterLink
            title="Accessibilité : non-conforme"
            icon={WalkIcon}
            description="Consultez la déclaration d’accessibilité"
            link="/accessibilite"
          />
        </Pane>
      </Pane>
    </div>
  );
}

export default Footer;
