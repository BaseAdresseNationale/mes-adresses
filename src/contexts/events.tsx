"use client";

import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { Event, BasesLocalesService } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import BalDataContext from "./bal-data";

const EVENTS_PAGE_SIZE = 30;

function sortByCreatedAtDesc(events: Event[]): Event[] {
  return [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function mergeEvents(current: Event[], incoming: Event[]): Event[] {
  const byId = new Map(current.map((event) => [event.id, event]));
  for (const event of incoming) {
    byId.set(event.id, event);
  }
  return sortByCreatedAtDesc([...byId.values()]);
}

interface EventsContextType {
  events: Event[];
  isLoadingEvents: boolean;
  hasMoreEvents: boolean;
  eventsCount: number;
  loadEvents: () => Promise<void>;
  loadMoreEvents: () => Promise<void>;
  reloadSyncedEventsCount: () => Promise<void>;
}

const EventsContext = React.createContext<EventsContextType | null>(null);

export function EventsContextProvider(props: ChildrenProps) {
  const { baseLocale } = useContext(BalDataContext);
  const [events, setEvents] = useState<Event[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);

  const hasMoreEvents = events.length < count;

  const reloadSyncedEventsCount = useCallback(async () => {
    const { count } = await BasesLocalesService.findBaseLocaleEvents(
      baseLocale.id,
      1,
      0
    );
    setEventsCount(count);
  }, [baseLocale.id]);

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const page = await BasesLocalesService.findBaseLocaleEvents(
        baseLocale.id,
        EVENTS_PAGE_SIZE,
        0
      );
      setEvents(sortByCreatedAtDesc(page.results));
      setCount(page.count);
      setOffset(page.results.length);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [baseLocale.id]);

  const loadMoreEvents = useCallback(async () => {
    if (isLoadingEvents || events.length >= count) {
      return;
    }
    setIsLoadingEvents(true);
    try {
      const page = await BasesLocalesService.findBaseLocaleEvents(
        baseLocale.id,
        EVENTS_PAGE_SIZE,
        offset
      );
      setEvents((current) => mergeEvents(current, page.results));
      setCount(page.count);
      setOffset((currentOffset) => currentOffset + page.results.length);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [baseLocale.id, offset, isLoadingEvents, events.length, count]);

  useEffect(() => {
    reloadSyncedEventsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseLocale.id]);

  const value = useMemo(
    () => ({
      events,
      isLoadingEvents,
      hasMoreEvents,
      eventsCount,
      loadEvents,
      loadMoreEvents,
      reloadSyncedEventsCount,
    }),
    [
      events,
      isLoadingEvents,
      hasMoreEvents,
      eventsCount,
      loadEvents,
      loadMoreEvents,
      reloadSyncedEventsCount,
    ]
  );

  return <EventsContext.Provider value={value} {...props} />;
}

export default EventsContext;
