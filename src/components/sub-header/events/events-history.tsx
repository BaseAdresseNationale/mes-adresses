"use client";

import { useContext } from "react";
import { Heading, Pane, Paragraph, Spinner, Text } from "evergreen-ui";

import { Event } from "@/lib/openapi-api-bal";
import EventsContext from "@/contexts/events";
import InfiniteScrollList from "@/components/infinite-scroll-list";
import EventRow from "./event-row";

function EventsHistory() {
  const { events, isLoadingEvents, loadMoreEvents } = useContext(EventsContext);

  return (
    <>
      <Pane padding={12} borderBottom="muted" flexShrink={0}>
        <Heading size={400}>Historique des modifications</Heading>
        <Paragraph>
          Selectionnez les modifications que vous souhaitez publier
        </Paragraph>
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
    </>
  );
}

export default EventsHistory;
