import { Pane, Button } from "evergreen-ui";

function Footer() {
  return (
    <Pane bottom={0} background="tint1" padding={16} elevation={1}>
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
  );
}

export default Footer;
