"use client";

import { useEffect, useMemo, useState } from "react";
import { Heading, HistoryIcon, Pane, Spinner, Text } from "evergreen-ui";

import { BaseLocale, BasesLocalesService, Event } from "@/lib/openapi-api-bal";
import { ApiDepotService } from "@/lib/api-depot";
import { Revision } from "@/lib/api-depot/types";
import RevisionRow from "./revision-row";

interface HistoryPublicationProps {
  baseLocale: BaseLocale;
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
          console.log(syncedEventsResult);
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
        ) : (
          revisions.map((revision) => (
            <RevisionRow
              key={revision.id}
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
