"use client";

import { useState } from "react";
import { Pane, Text, defaultTheme } from "evergreen-ui";

import {
  Event,
  SerializedNumero,
  SerializedPosition,
  SerializedToponyme,
  SerializedVoie,
} from "@/lib/openapi-api-bal";
import { getDuration } from "@/lib/utils/date";
import { getEventDetails } from "./event-details";

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
      return `de la voie « ${voie?.nom ?? "inconnue"} »`;
    }

    case Event.entityType.TOPONYME: {
      const toponyme = payload as SerializedToponyme;
      return `du toponyme « ${toponyme?.nom ?? "inconnu"} »`;
    }

    case Event.entityType.NUMERO: {
      const numero = payload as SerializedNumero;
      return `du numéro « ${numero?.numero ?? ""}${numero?.suffixe ?? ""} »`;
    }

    case Event.entityType.POSITION: {
      const position = payload as SerializedPosition;
      return `d'une position (${position?.type ?? "inconnue"})`;
    }

    default:
      return "un élément";
  }
}

function getEventDescription(event: Event): string {
  const action = ACTION_LABELS[event.action] ?? event.action;
  return `${action} ${getEventTargetLabel(event)}`;
}

interface EventRowProps {
  event: Event;
}

function EventRow({ event }: EventRowProps) {
  const [isActive, setIsActive] = useState(false);
  const details = getEventDetails(event);

  return (
    <Pane padding={10} borderBottom="muted">
      <Pane display="flex" alignItems="flex-start" gap={8}>
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
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginTop={2}
          >
            <Text size={300} color="muted">
              il y a {getDuration(new Date(event.createdAt))}
            </Text>
            {details && (
              <Text
                size={300}
                color="blue500"
                cursor="pointer"
                userSelect="none"
                onClick={() => setIsActive((active) => !active)}
              >
                {isActive ? "masquer" : "détails"}
              </Text>
            )}
          </Pane>
        </Pane>
      </Pane>

      {isActive && details && (
        <Pane paddingLeft={16} marginTop={8}>
          {details}
        </Pane>
      )}
    </Pane>
  );
}

export default EventRow;
