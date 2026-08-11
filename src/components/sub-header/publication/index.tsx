import { useCallback, useContext, useState } from "react";
import { Pane, Button, Popover, Position, Pill } from "evergreen-ui";

import StatusBadge from "@/components/status-badge";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import EventsContext from "@/contexts/events";
import styles from "./button-pill.module.css";
import PublicationPopover from "./publication-popover";

interface PublicationProps {
  baseLocale: ExtendedBaseLocaleDTO;
  isAdmin: boolean;
  onPublication: (ignoreEvents: string[]) => void;
}

function Publication({ baseLocale, isAdmin, onPublication }: PublicationProps) {
  const { events, loadEvents } = useContext(EventsContext);
  const [excludedEventIds, setExcludedEventIds] = useState<Set<string>>(
    new Set()
  );

  const toggleEventExclusion = useCallback((eventId: string) => {
    setExcludedEventIds((current) => {
      const next = new Set(current);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  }, []);

  function handleOpen() {
    setExcludedEventIds(new Set());
    if (events.length >= 0) {
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
              onPublication={(ignoreEvents) => {
                onPublication(ignoreEvents);
                close();
              }}
              eventsCount={baseLocale.eventsCount}
              balStatus={baseLocale.status}
              excludedEventIds={excludedEventIds}
              onToggleEvent={toggleEventExclusion}
            />
          )}
        >
          <Button
            marginRight={8}
            height={28}
            appearance="primary"
            disabled={
              baseLocale.eventsCount <= 0 &&
              baseLocale.status !== ExtendedBaseLocaleDTO.status.DRAFT
            }
          >
            {baseLocale.eventsCount > 0 && (
              <Pill className={styles["pill-top-right"]} color="blue">
                {baseLocale.eventsCount}
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
          eventsCount={baseLocale.eventsCount}
        />
      </Pane>
    </>
  );
}

export default Publication;
