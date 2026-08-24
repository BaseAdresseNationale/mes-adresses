"use client";

import React, { useState, useCallback, useContext, useMemo } from "react";
import { Event, BasesLocalesService } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import BalDataContext from "./bal-data";

export function sortByCreatedAtDesc(events: Event[]): Event[] {
  return [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

interface EventsContextType {
  events: Event[];
  isLoadingEvents: boolean;
  loadEvents: () => Promise<void>;
}

const EventsContext = React.createContext<EventsContextType | null>(null);

export function EventsContextProvider(props: ChildrenProps) {
  const { baseLocale } = useContext(BalDataContext);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      // Le typage généré (EventPageDTO) est obsolète : la route renvoie
      // désormais directement le tableau d'events, plus de pagination.
      const results = (await BasesLocalesService.findBaseLocaleEvents(
        baseLocale.id
      )) as unknown as Event[];
      setEvents(sortByCreatedAtDesc(results));
    } finally {
      setIsLoadingEvents(false);
    }
  }, [baseLocale.id]);

  const value = useMemo(
    () => ({
      events,
      isLoadingEvents,
      loadEvents,
    }),
    [events, isLoadingEvents, loadEvents]
  );

  return <EventsContext.Provider value={value} {...props} />;
}

export default EventsContext;
