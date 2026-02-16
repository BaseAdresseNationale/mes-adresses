import { Pane, Text, Button, WarningSignIcon } from "evergreen-ui";
import NextLink from "next/link";

interface WarningLinkProps {
  title: string;
  url: string;
}

function WarningLink({ title, url }: WarningLinkProps) {
  return (
    <>
      <Pane marginBottom={8}>
        <Text color="white">{title}</Text>
      </Pane>
      <Button is={NextLink} href={url} title="Éditer la voie" size="small">
        Améliorer
      </Button>
    </>
  );
}

export default WarningLink;
