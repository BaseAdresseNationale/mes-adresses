import {
  Event,
  ExtendedVoieDTO,
  SerializedNumero,
  SerializedPosition,
  SerializedToponyme,
  SerializedVoie,
} from "@/lib/openapi-api-bal";

const ACTION_LABELS: Record<Event.action, string> = {
  [Event.action.CREATE]: "Création",
  [Event.action.UPDATE]: "Modification",
  [Event.action.DELETE]: "Suppression",
};

export function getEventTargetLabel(
  event: Event,
  voies: ExtendedVoieDTO[]
): string {
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
      const voie = voies?.find((v) => v.id === numero?.voieId);
      return `du numéro « ${numero?.numero ?? ""}${numero?.suffixe ?? ""} ${voie ? `${voie.nom} ` : ""}»`;
    }

    case Event.entityType.POSITION: {
      const position = payload as SerializedPosition;
      return `d'une position (${position?.type ?? "inconnue"})`;
    }

    default:
      return "un élément";
  }
}

export function getEventDescription(
  event: Event,
  voies: ExtendedVoieDTO[]
): string {
  const action = ACTION_LABELS[event.action] ?? event.action;
  return `${action} ${getEventTargetLabel(event, voies)}`;
}
