import {
  TimeIcon,
  TickCircleIcon,
  PauseIcon,
  ErrorIcon,
  ManuallyEnteredDataIcon,
  LabTestIcon,
  IconComponent,
  EyeOpenIcon,
} from "evergreen-ui";

import { BaseLocale, BaseLocaleSync } from "./openapi-api-bal";

type StatusType = {
  label: string;
  title?: string;
  content: string;
  color:
    | "neutral"
    | "blue"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "teal"
    | "purple";
  textColor?: string;
  intent?: string;
  icon: IconComponent;
};

const STATUSES: { [key: string]: StatusType } = {
  consultation: {
    label: "Consultation",
    title: "Vous consultez cette Base Adresse Locale",
    content:
      "Vous consultez cette Base Adresse Locale, aucune modification ne sera répercutée dans la Base Adresse Nationale.",
    color: "yellow",
    intent: "none",
    icon: EyeOpenIcon,
  },
  paused: {
    label: "Suspendue",
    title:
      "Les mises à jour automatiques de cette Base Adresse Locale sont actuellement suspendues, elle n’alimente plus la Base Adresse Nationale",
    content:
      "Les mises à jour automatiques de cette Base Adresse Locale sont actuellement suspendues. Vous pouvez relancer la synchronisation à tout moment.",
    color: "yellow",
    intent: "warning",
    icon: PauseIcon,
  },
  "no-habilitation": {
    label: "Aucune habilitation",
    title:
      "Cette Base Adresse Locale a besoin d'une habilitation pour alimenter la Base Adresse Nationale",
    content:
      "Les modifications ne seront pas répercutées dans la Base Adresse Nationale.",
    color: "yellow",
    intent: "none",
    icon: TimeIcon,
  },
  outdated: {
    label: "Mise à jour programmée",
    title: "Cette Base Adresse Locale va alimenter la Base Adresse Nationale",
    content:
      "De nouvelles modifications ont été détectées, elles seront automatiquement répercutées dans la Base Adresse Nationale dans les prochaines heures.",
    color: "blue",
    intent: "none",
    icon: TimeIcon,
  },
  synced: {
    label: "À jour",
    title: "Cette Base Adresse Locale alimente la Base Adresse Nationale",
    content:
      "Cette Base Adresse Locale est à jour avec la Base Adresse Nationale. Toute modification sera automatiquement répercutée dans la Base Adresse Nationale dans les prochaines heures.",
    color: "green",
    intent: "success",
    icon: TickCircleIcon,
  },
  replaced: {
    label: "Remplacée",
    title:
      "Cette Base Adresse Locale n’alimente plus la Base Adresse Nationale",
    content:
      "Une autre Base Adresses Locale est aussi synchronisée avec la Base Adresse Nationale. Veuillez entrer en contact les administrateurs de l’autre Base Adresse Locale ou notre support: adresse@data.gouv.fr",
    color: "red",
    intent: "danger",
    icon: ErrorIcon,
  },
  draft: {
    content: "Cette Base Adresses Locale est en cours de construction",
    label: "Brouillon",
    color: "neutral",
    icon: ManuallyEnteredDataIcon,
  },
  demo: {
    content:
      "Base Adresse Locale de démonstration, aucune adresse ne sera transmise à la Base Adresse Nationale",
    label: "Démonstration",
    color: "orange",
    textColor: "black",
    intent: "danger",
    icon: LabTestIcon,
  },
};

export function computeStatus(
  balStatus: BaseLocale.status,
  sync: Partial<BaseLocaleSync>,
  isHabilitationValid: boolean
): StatusType {
  if (sync?.isPaused && balStatus !== BaseLocale.status.REPLACED) {
    return STATUSES.paused;
  }

  if (balStatus === BaseLocale.status.PUBLISHED && sync.status) {
    if (!isHabilitationValid) {
      return STATUSES["no-habilitation"];
    }
    return STATUSES[sync.status];
  }

  return STATUSES[balStatus];
}
