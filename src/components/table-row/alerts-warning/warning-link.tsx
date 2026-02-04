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
        <WarningSignIcon
          color="white"
          style={{ verticalAlign: "middle" }}
          marginRight={4}
        />
        <Text color="white">{title}</Text>
      </Pane>
      <Button is={NextLink} href={url} title="Éditer la voie" size="small">
        Corriger
      </Button>
    </>
  );
}

export default WarningLink;
