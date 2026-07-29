"use client";

import { useEffect, useState } from "react";
import { Heading, HistoryIcon, Pane, Spinner, Text } from "evergreen-ui";

import { BaseLocale } from "@/lib/openapi-api-bal";
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

function HistoryPublication({ baseLocale }: HistoryPublicationProps) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchRevisions() {
      setIsLoading(true);
      setHasError(false);
      try {
        const result = await ApiDepotService.getRevisions(baseLocale.commune);
        if (isMounted) {
          setRevisions(sortByPublishedAtDesc(result));
        }
      } catch (error) {
        console.error(
          "ERROR: Impossible de récupérer les révisions pour cette commune",
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

    fetchRevisions();

    return () => {
      isMounted = false;
    };
  }, [baseLocale.commune]);

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
              baseLocaleId={baseLocale.id}
            />
          ))
        )}
      </Pane>
    </Pane>
  );
}

export default HistoryPublication;
