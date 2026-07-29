"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  defaultTheme,
  Pane,
  Text,
} from "evergreen-ui";

import { Revision } from "@/lib/api-depot/types";
import { BasesLocalesService, Event } from "@/lib/openapi-api-bal";
import { sortByCreatedAtDesc, mergeEvents } from "@/contexts/events";
import { getDuration, getFullDate } from "@/lib/utils/date";
import EventsHistory from "../sub-header/events/events-history";

const REVISION_EVENTS_PAGE_SIZE = 30;

interface RevisionRowProps {
  revision: Revision;
  baseLocaleId: string;
}

function RevisionRow({ revision, baseLocaleId }: RevisionRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const revisionDate = new Date(revision.publishedAt ?? revision.createdAt);

  const loadEvents = async (currentOffset: number) => {
    setIsLoadingEvents(true);
    try {
      const page = await BasesLocalesService.findBaseLocaleSyncedEvents(
        revision.id,
        baseLocaleId,
        REVISION_EVENTS_PAGE_SIZE,
        currentOffset
      );
      setEvents((current) =>
        currentOffset === 0
          ? sortByCreatedAtDesc(page.results)
          : mergeEvents(current, page.results)
      );
      setCount(page.count);
      setOffset(currentOffset + page.results.length);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleToggle = () => {
    setIsOpen((open) => !open);
    if (!hasLoaded) {
      setHasLoaded(true);
      loadEvents(0);
    }
  };

  const loadMoreEvents = async () => {
    if (isLoadingEvents || events.length >= count) {
      return;
    }
    await loadEvents(offset);
  };

  return (
    <Pane borderBottom="default">
      <Pane
        display="flex"
        alignItems="center"
        gap={8}
        padding={12}
        cursor="pointer"
        onClick={handleToggle}
        backgroundColor={defaultTheme.colors.gray100}
      >
        {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
        <Pane flex={1} minWidth={0}>
          <Text display="block" size={400}>
            Révision publiée le {getFullDate(revisionDate)}
          </Text>
          <Text size={300} color="muted">
            il y a {getDuration(revisionDate)}
          </Text>
        </Pane>
      </Pane>

      {isOpen && (
        <Pane display="flex" flexDirection="column">
          <EventsHistory
            events={events}
            isLoadingEvents={isLoadingEvents}
            onReachEnd={loadMoreEvents}
            emptyMessage="Aucun modification trouvé"
          />
        </Pane>
      )}
    </Pane>
  );
}

export default RevisionRow;
