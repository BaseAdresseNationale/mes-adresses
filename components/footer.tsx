import { useContext, useCallback } from "react";
import {
  Pane,
  Heading,
  Button,
  Paragraph,
  ManualIcon,
  IconComponent,
} from "evergreen-ui";

import HelpContext from "@/contexts/help";

import useHelp from "@/hooks/help";
import LayoutContext from "@/contexts/layout";

interface FooterLinkProps {
  title: string;
  description?: string;
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

      {description && (
        <Paragraph marginTop={4} textAlign="center" fontStyle="italic">
          <small>{description}</small>
        </Paragraph>
      )}
    </Pane>
  );
}

function Footer() {
  const { showHelp, setShowHelp, setSelectedIndex } = useContext(HelpContext);
  const { isMobile } = useContext(LayoutContext);

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
          {...(isMobile
            ? { display: "flex", flexDirection: "column" }
            : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr" })}
          justifyContent="space-between"
          alignItems="center"
          overflow="hidden"
        >
          <FooterLink
            title="Guides de l’adressage"
            icon={ManualIcon}
            link="https://adresse.data.gouv.fr/guides"
            {...(!isMobile && {
              description:
                "Pour vous accompagner dans la gestion des adresses de votre commune",
            })}
          />
          <FooterLink
            title="Guide interactif"
            icon={ManualIcon}
            onClick={handleHelp}
            {...(!isMobile && {
              description: "Le manuel de l’éditeur toujours à porté de main",
            })}
          />
          <Pane display="flex" flexDirection="column" alignItems="center">
            <Button
              is="a"
              appearance="minimal"
              height={30}
              href="/mentions-legales"
              fontSize="0.8em"
            >
              Mentions Légales
            </Button>
            <Button
              is="a"
              appearance="minimal"
              height={30}
              href="/accessibilite"
              target="_blank"
              fontSize="0.8em"
            >
              Accessibilité : non-conforme
            </Button>
          </Pane>
        </Pane>
      </Pane>
    </div>
  );
}

export default Footer;
