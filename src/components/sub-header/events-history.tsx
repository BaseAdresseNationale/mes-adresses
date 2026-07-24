"use client";

import { useContext } from "react";
import {
  Badge,
  Heading,
  HistoryIcon,
  IconButton,
  Pane,
  Pill,
  Popover,
  Position,
  Spinner,
  Text,
  defaultTheme,
} from "evergreen-ui";

import {
  ConvertVoieToToponymeAfterPayload,
  Event,
  MergeVoiesAfterPayload,
  MergeVoiesBeforePayload,
  SerializedNumero,
  SerializedPosition,
  SerializedToponyme,
  SerializedVoie,
} from "@/lib/openapi-api-bal";
import EventsContext from "@/contexts/events";
import InfiniteScrollList from "@/components/infinite-scroll-list";
import { getDuration } from "@/lib/utils/date";
import styles from "./events-history.module.css";

const ACTION_LABELS: Record<Event.action, string> = {
  [Event.action.CREATE]: "Création",
  [Event.action.UPDATE]: "Modification",
  [Event.action.DELETE]: "Suppression",
  [Event.action.MERGE_VOIES]: "Fusion",
  [Event.action.CONVERT_VOIE_TO_TOPONYME]: "Conversion",
};

const ACTION_COLORS: Record<Event.action, string> = {
  [Event.action.CREATE]: defaultTheme.colors.green600,
  [Event.action.UPDATE]: defaultTheme.colors.blue600,
  [Event.action.DELETE]: defaultTheme.colors.red600,
  [Event.action.MERGE_VOIES]: defaultTheme.colors.purple600,
  [Event.action.CONVERT_VOIE_TO_TOPONYME]: defaultTheme.colors.purple600,
};

function getEventTargetLabel(event: Event): string {
  const payload =
    event.action === Event.action.DELETE
      ? event.payloadBefore
      : event.payloadAfter;

  switch (event.entityType) {
    case Event.entityType.VOIE: {
      const voie = payload as SerializedVoie;
      return `la voie « ${voie?.nom ?? "inconnue"} »`;
    }

    case Event.entityType.TOPONYME: {
      const toponyme = payload as SerializedToponyme;
      return `le toponyme « ${toponyme?.nom ?? "inconnu"} »`;
    }

    case Event.entityType.NUMERO: {
      const numero = payload as SerializedNumero;
      return `le numéro ${numero?.numero ?? ""}${numero?.suffixe ?? ""}`;
    }

    case Event.entityType.POSITION: {
      const position = payload as SerializedPosition;
      return `une position (${position?.type ?? "inconnue"})`;
    }

    case Event.entityType.COMPOSITE: {
      if (event.action === Event.action.MERGE_VOIES) {
        const mergePayload = payload as
          | MergeVoiesBeforePayload
          | MergeVoiesAfterPayload;
        return `des voies vers « ${mergePayload?.targetVoie?.nom ?? "inconnue"} »`;
      }

      if (event.action === Event.action.CONVERT_VOIE_TO_TOPONYME) {
        const convertPayload =
          event.payloadAfter as ConvertVoieToToponymeAfterPayload;
        return `la voie en toponyme « ${convertPayload?.toponyme?.nom ?? "inconnu"} »`;
      }

      return "un élément composite";
    }

    default:
      return "un élément";
  }
}

function getEventDescription(event: Event): string {
  const action = ACTION_LABELS[event.action] ?? event.action;
  return `${action} de ${getEventTargetLabel(event)}`;
}

interface EventRowProps {
  event: Event;
}

function EventRow({ event }: EventRowProps) {
  return (
    <Pane
      display="flex"
      alignItems="flex-start"
      gap={10}
      padding={10}
      borderBottom="muted"
    >
      <Pane
        flexShrink={0}
        marginTop={5}
        width={8}
        height={8}
        borderRadius="50%"
        backgroundColor={ACTION_COLORS[event.action]}
      />

      <Pane flex={1} minWidth={0}>
        <Text display="block" size={400}>
          {getEventDescription(event)}
        </Text>
        <Text display="block" size={300} color="muted" marginTop={2}>
          il y a {getDuration(new Date(event.createdAt))}
        </Text>
      </Pane>

      <Badge
        color={event.isSynced ? "green" : "neutral"}
        flexShrink={0}
        marginTop={2}
      >
        {event.isSynced ? "Synchronisé" : "En attente"}
      </Badge>
    </Pane>
  );
}

function EventsHistory() {
  const {
    events,
    isLoadingEvents,
    eventsCount,
    loadEvents,
    loadMoreEvents,
    reloadSyncedEventsCount,
  } = useContext(EventsContext);
  function handleOpen() {
    reloadSyncedEventsCount();
    if (events.length === 0) {
      loadEvents();
    }
  }

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      onOpen={handleOpen}
      content={
        <Pane width={380} height={460} display="flex" flexDirection="column">
          <Pane padding={12} borderBottom="muted" flexShrink={0}>
            <Heading size={400}>Historique des modifications</Heading>
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
        </Pane>
      }
    >
      <Pane position="relative" display="inline-flex">
        <IconButton
          type="button"
          icon={HistoryIcon}
          appearance="minimal"
          height={24}
          title="Historique des modifications"
        />
        {eventsCount > 0 && (
          <Pill className={styles["pill-top-right"]} color="blue">
            {eventsCount}
          </Pill>
        )}
      </Pane>
    </Popover>
  );
}

export default EventsHistory;
