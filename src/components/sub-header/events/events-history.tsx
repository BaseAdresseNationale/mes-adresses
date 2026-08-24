"use client";

import { Pane, Spinner, Text } from "evergreen-ui";

import { Event } from "@/lib/openapi-api-bal";
import InfiniteScrollList from "@/components/infinite-scroll-list";
import EventRow from "./event-row";

interface EventsHistoryProps {
  events: Event[];
  isLoadingEvents?: boolean;
  onReachEnd?: () => void;
  emptyMessage?: string;
  excludedEventIds?: Set<string>;
  onToggleEvent?: (eventId: string) => void;
}

function EventsHistory({
  events,
  isLoadingEvents = false,
  onReachEnd,
  emptyMessage = "Aucune modification pour le moment.",
  excludedEventIds,
  onToggleEvent,
}: EventsHistoryProps) {
  return (
    <Pane flex={1} display="flex" height={310}>
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
          <Text color="muted">{emptyMessage}</Text>
        </Pane>
      ) : (
        <InfiniteScrollList items={events} onReachEnd={onReachEnd}>
          {(event: Event) => (
            <EventRow
              key={event.id}
              event={event}
              isExcluded={excludedEventIds?.has(event.id)}
              onToggle={
                onToggleEvent ? () => onToggleEvent(event.id) : undefined
              }
            />
          )}
        </InfiniteScrollList>
      )}
    </Pane>
  );
}

export default EventsHistory;
