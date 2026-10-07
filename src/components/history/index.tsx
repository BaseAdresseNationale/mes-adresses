"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import {
  Heading,
  HistoryIcon,
  Pane,
  SearchInput,
  Spinner,
  Text,
} from "evergreen-ui";

import { BaseLocale, BasesLocalesService, Event } from "@/lib/openapi-api-bal";
import { ApiDepotService } from "@/lib/api-depot";
import { Revision } from "@/lib/api-depot/types";
import BalDataContext from "@/contexts/bal-data";
import useFuse from "@/hooks/fuse";
import { getEventDescription } from "@/lib/events/event-description";
import RevisionRow from "./revision-row";

interface HistoryPublicationProps {
  baseLocale: BaseLocale;
}

// Fuse.js note ses correspondances en tenant compte de la position/longueur
// de la chaîne testée : sur une description agrégeant beaucoup d'events, un
// petit mot isolé perd du score et n'est plus retrouvé. En donnant à Fuse un
// tableau de mots plutôt qu'une seule longue chaîne, chaque mot est noté
// indépendamment — un seul mot qui matche suffit à faire remonter la révision.
function tokenizeDescription(text: string): string[] {
  return text
    .split(/[\s«»,·]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function sortByPublishedAtDesc(revisions: Revision[]): Revision[] {
  return [...revisions].sort((a, b) => {
    const dateA = new Date(a.publishedAt ?? a.createdAt).getTime();
    const dateB = new Date(b.publishedAt ?? b.createdAt).getTime();
    return dateB - dateA;
  });
}

// Chaque event synchronisé porte l'id de la révision qui l'a publié
// (`isSyncedWithRevision`) : le rattachement est direct, pas besoin
// d'heuristique par date.
function matchEventsToRevisions(events: Event[]): Map<string, Event[]> {
  const eventsByRevisionId = new Map<string, Event[]>();

  for (const event of events) {
    if (!event.isSyncedWithRevision) {
      continue;
    }
    const bucket = eventsByRevisionId.get(event.isSyncedWithRevision) ?? [];
    bucket.push(event);
    eventsByRevisionId.set(event.isSyncedWithRevision, bucket);
  }
  return eventsByRevisionId;
}

function HistoryPublication({ baseLocale }: HistoryPublicationProps) {
  const { voies } = useContext(BalDataContext);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [syncedEvents, setSyncedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      setIsLoading(true);
      setHasError(false);
      try {
        const [revisionsResult, syncedEventsResult] = await Promise.all([
          ApiDepotService.getRevisions(baseLocale.commune),
          BasesLocalesService.findBaseLocaleSyncedEvents(baseLocale.id),
        ]);
        if (isMounted) {
          setRevisions(sortByPublishedAtDesc(revisionsResult));
          setSyncedEvents(syncedEventsResult);
        }
      } catch (error) {
        console.error(
          "ERROR: Impossible de récupérer l'historique des révisions",
          error
        );
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [baseLocale.commune, baseLocale.id]);

  const eventsByRevisionId = useMemo(
    () => matchEventsToRevisions(syncedEvents),
    [syncedEvents]
  );

  const revisionsWithSearchText = useMemo(
    () =>
      revisions.map((revision) => {
        const events =
          (revision.id && eventsByRevisionId.get(revision.id)) || [];
        return {
          ...revision,
          eventDescriptionWords: events.flatMap((event) =>
            tokenizeDescription(getEventDescription(event, voies))
          ),
        };
      }),
    [revisions, eventsByRevisionId, voies]
  );

  const [filteredRevisions, setSearch] = useFuse(revisionsWithSearchText, 200, {
    keys: ["eventDescriptionWords"],
  });

  return (
    <Pane display="flex" flexDirection="column" flex={1} overflow="hidden">
      <Pane
        flexShrink={0}
        elevation={0}
        background="white"
        padding={16}
        display="flex"
        alignItems="center"
        minHeight={64}
      >
        <Pane display="flex" alignItems="center">
          <HistoryIcon />
          <Heading paddingLeft={5}>Historique des Publications</Heading>
        </Pane>
      </Pane>

      {!isLoading && !hasError && revisions.length > 0 && (
        <Pane flexShrink={0} padding={16} borderBottom="muted">
          <SearchInput
            width="100%"
            placeholder="Rechercher dans les modifications publiées"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Pane>
      )}

      <Pane flex={1}>
        {isLoading ? (
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={32}
          >
            <Spinner size={32} />
          </Pane>
        ) : hasError ? (
          <Pane padding={16}>
            <Text color="muted">
              Impossible de récupérer l&apos;historique des révisions.
            </Text>
          </Pane>
        ) : revisions.length === 0 ? (
          <Pane padding={16}>
            <Text color="muted">Aucune révision publiée pour le moment.</Text>
          </Pane>
        ) : filteredRevisions.length === 0 ? (
          <Pane padding={16}>
            <Text color="muted">
              Aucune révision ne correspond à cette recherche.
            </Text>
          </Pane>
        ) : (
          filteredRevisions.map((revision) => (
            <RevisionRow
              key={revision.id}
              balId={baseLocale.id}
              revision={revision}
              events={
                (revision.id && eventsByRevisionId.get(revision.id)) || []
              }
            />
          ))
        )}
      </Pane>
    </Pane>
  );
}

export default HistoryPublication;
