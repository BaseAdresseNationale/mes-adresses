import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";
import { Pane, Text, Button, defaultTheme } from "evergreen-ui";
import NextLink from "next/link";
import { useCallback, useContext } from "react";

interface WarningLinkProps {
  title: string;
  url: string;
}

function WarningLink({ title, url }: WarningLinkProps) {
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const handleMatomoEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    matomoTrackEvent(
      MatomoEventCategory.QUALITY,
      MatomoEventAction[MatomoEventCategory.QUALITY].IMPROVE_SUGGESTION
    );
  };

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
        onClick={handleMatomoEvent}
      >
        Améliorer
      </Button>
    </>
  );
}

export default WarningLink;
