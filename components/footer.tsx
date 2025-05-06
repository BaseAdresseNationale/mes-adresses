import { Pane, Button } from "evergreen-ui";
import NextLink from "next/link";

function Footer() {
  return (
    <Pane
      bottom={0}
      background="tint1"
      padding={16}
      borderTop="1px solid #E6E8F0"
    >
      <Button
        is={NextLink}
        appearance="minimal"
        height={30}
        href="/mentions-legales"
        fontSize="0.8em"
      >
        Mentions Légales
      </Button>
      <Button
        is={NextLink}
        appearance="minimal"
        height={30}
        href="/accessibilite"
        fontSize="0.8em"
      >
        Accessibilité : non-conforme
      </Button>
    </Pane>
  );
}

export default Footer;
