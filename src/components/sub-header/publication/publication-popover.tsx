import { useContext } from "react";
import { Pane, Button, Heading, Paragraph } from "evergreen-ui";

import EventsHistory from "../events/events-history";
import EventsContext from "@/contexts/events";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface PublicationPopoverProps {
  onPublication: (ignoreEvents: string[]) => void;
  eventsCount: number;
  balStatus: ExtendedBaseLocaleDTO.status;
  excludedEventIds: Set<string>;
  onToggleEvent: (eventId: string) => void;
}

function PublicationPopover({
  onPublication,
  eventsCount,
  balStatus,
  excludedEventIds,
  onToggleEvent,
}: PublicationPopoverProps) {
  const { events, isLoadingEvents } = useContext(EventsContext);
  const checkedCount = eventsCount - excludedEventIds.size;
  const isDisabled =
    balStatus !== ExtendedBaseLocaleDTO.status.DRAFT && checkedCount <= 0;

  return (
    <Pane width={420} height={460} display="flex" flexDirection="column">
      <Pane padding={12} borderBottom="muted" flexShrink={0}>
        <Heading size={400}>Historique des modifications</Heading>
        <Paragraph>
          Décocher les modifications que vous ne voulez pas publier
        </Paragraph>
      </Pane>
      <EventsHistory
        events={events}
        isLoadingEvents={isLoadingEvents}
        excludedEventIds={excludedEventIds}
        onToggleEvent={onToggleEvent}
      />
      <Pane
        padding={12}
        borderTop="muted"
        display="flex"
        justifyContent="right"
      >
        <Button
          appearance="primary"
          onClick={() => onPublication(Array.from(excludedEventIds))}
          disabled={isDisabled}
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
