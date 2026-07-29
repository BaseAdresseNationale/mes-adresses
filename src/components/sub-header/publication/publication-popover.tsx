import { Pane, Button } from "evergreen-ui";

import EventsHistory from "../events/events-history";
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
  return (
    <Pane width={420} height={460} display="flex" flexDirection="column">
      <EventsHistory />
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
