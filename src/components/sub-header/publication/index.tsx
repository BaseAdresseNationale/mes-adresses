import { useContext } from "react";
import { Pane, Button, Popover, Position, Pill } from "evergreen-ui";

import StatusBadge from "@/components/status-badge";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import EventsContext from "@/contexts/events";
import styles from "./button-pill.module.css";
import PublicationPopover from "./publication-popover";

interface PublicationProps {
  baseLocale: ExtendedBaseLocaleDTO;
  isAdmin: boolean;
  onPublication: () => void;
}

function Publication({ baseLocale, isAdmin, onPublication }: PublicationProps) {
  const { events, eventsCount, loadEvents, reloadSyncedEventsCount } =
    useContext(EventsContext);

  function handleOpen() {
    reloadSyncedEventsCount();
    if (events.length === 0) {
      loadEvents();
    }
  }

  return (
    <>
      {isAdmin && (
        <Popover
          position={Position.BOTTOM_RIGHT}
          onOpen={handleOpen}
          content={({ close }) => (
            <PublicationPopover
              onPublication={() => {
                onPublication();
                close();
              }}
              eventsCount={eventsCount}
              balStatus={baseLocale.status}
            />
          )}
        >
          <Button
            marginRight={8}
            height={28}
            appearance="primary"
            disabled={
              eventsCount <= 0 &&
              baseLocale.status !== ExtendedBaseLocaleDTO.status.DRAFT
            }
          >
            {eventsCount > 0 && (
              <Pill className={styles["pill-top-right"]} color="blue">
                {eventsCount}
              </Pill>
            )}
            Publier
          </Button>
        </Popover>
      )}

      <Pane height={28} marginRight={8}>
        <StatusBadge
          status={baseLocale.status}
          sync={baseLocale.sync}
          eventsCount={eventsCount}
        />
      </Pane>
    </>
  );
}

export default Publication;
