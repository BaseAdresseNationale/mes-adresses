"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  ChevronDownIcon,
  ChevronRightIcon,
  defaultTheme,
  Pane,
  Text,
} from "evergreen-ui";

import { PublicClient, Revision } from "@/lib/api-depot/types";
import { BasesLocalesService, Event } from "@/lib/openapi-api-bal";
import { sortByCreatedAtDesc, mergeEvents } from "@/contexts/events";
import { getDuration } from "@/lib/utils/date";
import EventsHistory from "../sub-header/events/events-history";

const REVISION_EVENTS_PAGE_SIZE = 30;

interface ClientBadgeProps {
  client: PublicClient;
}

const ClientBadge = ({ client }: ClientBadgeProps) => {
  if (client.legacyId === "mes-adresses") {
    return <Badge color="blue">MES ADRESSES</Badge>;
  } else if (client.legacyId === "formulaire-publication") {
    return <Badge color="yellow">FORMULAIRE DE PUBLICATION</Badge>;
  } else if (client.legacyId === "moissonneur-bal") {
    return <Badge color="purple">MOISSONNEUR</Badge>;
  } else {
    return <Badge color="orange">{client?.nom}</Badge>;
  }
};

interface RevisionRowProps {
  revision: Revision;
  baseLocaleId: string;
}

function RevisionRow({ revision, baseLocaleId }: RevisionRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Tant que le premier chargement n'est pas terminé, on ne sait pas encore
  // si cette révision a des events — le chevron reste affiché par défaut
  // (optimiste : la plupart des révisions en ont) le temps de le savoir.
  const [hasLoaded, setHasLoaded] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);

  const revisionDate = new Date(revision.publishedAt ?? revision.createdAt);

  const loadEvents = useCallback(
    async (currentOffset: number) => {
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
        setHasLoaded(true);
      }
    },
    [revision.id, baseLocaleId]
  );

  // Chargé dès le montage (et non plus au premier clic) : c'est le seul
  // moyen de savoir si cette révision a des events, pour décider d'afficher
  // ou non le chevron.
  useEffect(() => {
    loadEvents(0);
  }, [loadEvents]);

  const hasEvents = !hasLoaded || count > 0;

  const handleToggle = () => {
    if (hasEvents) {
      setIsOpen((open) => !open);
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
        cursor={hasEvents ? "pointer" : "default"}
        onClick={handleToggle}
        backgroundColor={defaultTheme.colors.gray100}
      >
        <Pane
          flexShrink={0}
          width={16}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {hasEvents && (isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />)}
        </Pane>
        <Pane
          flex={1}
          minWidth={0}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={8}
        >
          <Text display="block" size={400}>
            Révision publiée {getDuration(revisionDate)}
          </Text>
          <ClientBadge client={revision.client} />
        </Pane>
      </Pane>

      {isOpen && hasEvents && (
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
