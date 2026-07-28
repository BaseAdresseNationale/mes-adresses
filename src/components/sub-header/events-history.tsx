"use client";

import { useContext } from "react";
import {
  Heading,
  HistoryIcon,
  IconButton,
  Pane,
  Pill,
  Popover,
  Position,
  Spinner,
  Text,
} from "evergreen-ui";

import { Event } from "@/lib/openapi-api-bal";
import EventsContext from "@/contexts/events";
import InfiniteScrollList from "@/components/infinite-scroll-list";
import EventRow from "./event-row";
import styles from "./events-history.module.css";

function EventsHistory() {
  const {
    events,
    isLoadingEvents,
    eventsCount,
    loadEvents,
    loadMoreEvents,
    reloadSyncedEventsCount,
  } = useContext(EventsContext);

  function handleOpen() {
    reloadSyncedEventsCount();
    if (events.length === 0) {
      loadEvents();
    }
  }

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      onOpen={handleOpen}
      content={
        <Pane width={380} height={460} display="flex" flexDirection="column">
          <Pane padding={12} borderBottom="muted" flexShrink={0}>
            <Heading size={400}>Historique des modifications</Heading>
          </Pane>

          <Pane flex={1} overflow="hidden" display="flex">
            {isLoadingEvents && events.length === 0 ? (
              <Pane
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Spinner size={32} />
              </Pane>
            ) : events.length === 0 ? (
              <Pane
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding={16}
              >
                <Text color="muted">Aucune modification pour le moment.</Text>
              </Pane>
            ) : (
              <InfiniteScrollList items={events} onReachEnd={loadMoreEvents}>
                {(event: Event) => <EventRow key={event.id} event={event} />}
              </InfiniteScrollList>
            )}
          </Pane>
        </Pane>
      }
    >
      <Pane position="relative" display="inline-flex">
        <IconButton
          type="button"
          icon={HistoryIcon}
          appearance="minimal"
          height={24}
          title="Historique des modifications"
        />
        {eventsCount > 0 && (
          <Pill className={styles["pill-top-right"]} color="blue">
            {eventsCount}
          </Pill>
        )}
      </Pane>
    </Popover>
  );
}

export default EventsHistory;
