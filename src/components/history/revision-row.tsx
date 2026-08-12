"use client";

import { useState } from "react";
import {
  Badge,
  ChevronDownIcon,
  ChevronRightIcon,
  defaultTheme,
  Pane,
  Text,
} from "evergreen-ui";

import { PublicClient, Revision } from "@/lib/api-depot/types";
import { Event } from "@/lib/openapi-api-bal";
import { sortByCreatedAtDesc } from "@/contexts/events";
import { getDuration } from "@/lib/utils/date";
import EventsHistory from "../sub-header/events/events-history";

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
  events: Event[];
}

function RevisionRow({ revision, events }: RevisionRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const revisionDate = new Date(revision.publishedAt ?? revision.createdAt);
  const sortedEvents = sortByCreatedAtDesc(events);
  const hasEvents = sortedEvents.length > 0;

  const handleToggle = () => {
    if (hasEvents) {
      setIsOpen((open) => !open);
    }
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
            events={sortedEvents}
            emptyMessage="Aucun modification trouvé"
          />
        </Pane>
      )}
    </Pane>
  );
}

export default RevisionRow;
