import {
  TickCircleIcon,
  IssueIcon,
  ErrorIcon,
  ManuallyEnteredDataIcon,
  LabTestIcon,
  IconComponent,
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
  outdated: {
    label: "Modifications non publiées",
    title: "Cette Base Adresse Locale va alimenter la Base Adresse Nationale",
    content:
      "De nouvelles modifications ont été détectées, elles seront automatiquement répercutées dans la Base Adresse Nationale dans les prochaines heures.",
    color: "blue",
    intent: "none",
    icon: IssueIcon,
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
  eventsCount: number
): StatusType {
  if (balStatus === BaseLocale.status.PUBLISHED) {
    if (sync.status === BaseLocaleSync.status.CONFLICT) {
      return STATUSES.replaced;
    } else if (eventsCount > 0) {
      return STATUSES.outdated;
    }
    return STATUSES.synced;
  }

  return STATUSES[balStatus];
}
