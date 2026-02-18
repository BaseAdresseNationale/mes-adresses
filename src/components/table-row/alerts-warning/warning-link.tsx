import {
  Pane,
  Text,
  Button,
  WarningSignIcon,
  defaultTheme,
} from "evergreen-ui";
import NextLink from "next/link";

interface WarningLinkProps {
  title: string;
  url: string;
}

function WarningLink({ title, url }: WarningLinkProps) {
  return (
    <>
      <Pane marginBottom={8}>
        <Text>{title}</Text>
      </Pane>
      <Button
        is={NextLink}
        href={url}
        title="Éditer la voie"
        size="small"
        appearance="primary"
        style={{ backgroundColor: defaultTheme.colors.purple600 }}
      >
        Améliorer
      </Button>
    </>
  );
}

export default WarningLink;
