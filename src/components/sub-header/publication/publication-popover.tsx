import { useContext } from "react";
import { Pane, Button, Heading } from "evergreen-ui";

import EventsHistory from "../events/events-history";
import EventsContext from "@/contexts/events";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface PublicationPopoverProps {
  onPublication: () => void;
  eventsCount: number;
  balStatus: ExtendedBaseLocaleDTO.status;
}

function PublicationPopover({
  onPublication,
  eventsCount,
  balStatus,
}: PublicationPopoverProps) {
  const { events, isLoadingEvents, loadMoreEvents } = useContext(EventsContext);

  return (
    <Pane width={420} height={460} display="flex" flexDirection="column">
      <Pane padding={12} borderBottom="muted" flexShrink={0}>
        <Heading size={400}>Historique des modifications</Heading>
      </Pane>
      <EventsHistory
        events={events}
        isLoadingEvents={isLoadingEvents}
        onReachEnd={loadMoreEvents}
      />
      <Pane
        padding={12}
        borderTop="muted"
        display="flex"
        justifyContent="right"
      >
        <Button
          appearance="primary"
          onClick={onPublication}
          disabled={
            eventsCount <= 0 && balStatus !== ExtendedBaseLocaleDTO.status.DRAFT
          }
        >
          {balStatus === ExtendedBaseLocaleDTO.status.DRAFT
            ? "Publier"
            : "Publier modifications"}
        </Button>
      </Pane>
    </Pane>
  );
}

export default PublicationPopover;
