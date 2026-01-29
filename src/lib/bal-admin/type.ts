export interface BALWidgetLink {
  label: string;
  url: string;
}

export interface BALWidgetConfig {
  global: {
    title: string;
    hideWidget: boolean;
    showOnPages: string[];
  };
  communes: {
    outdatedApiDepotClients: string[];
    outdatedHarvestSources: string[];
  };
  gitbook: {
    welcomeBlockTitle: string;
    topArticles: BALWidgetLink[];
  };
  contactUs: {
    welcomeBlockTitle: string;
    subjects: string[];
  };
}

export enum EventTypeTypeEnum {
  FORMATION = "formation",
  FORMATION_LVL2 = "formation-lvl2",
  FORMATION_SPECIALE = "formation spéciale",
  PARTENAIRE = "partenaire",
  ADRESSE_LAB = "adresselab",
  ADRESSE_REGION = "adresse-region",
  PRESENTATION = "présentation",
}

export enum EventTypeTagEnum {
  PROGRAMME_BAL = "Programme Base Adresse Locale",
  BAL = "Base Adresse Locale",
  COMMUNE = "Commune",
  BAN = "Base Adresse Nationale",
  GOUVERNANCE = "Gouvernance",
  ADRESSE = "Adresse",
  REFERENTIELS = "Referentiel",
  CO_CONSTRUCTION = "Co construction",
  ADRESSE_LAB = "Adresse_Lab",
  TECHNIQUE = "Technique",
  AGILE = "Agile",
  UTILISATEURS = "Utilisateurs",
}

export type EventType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  subtitle: string;
  description: string;
  type: EventTypeTypeEnum;
  target: string;
  date: string;
  tags: EventTypeTagEnum[];
  isOnlineOnly: boolean;
  address?: {
    nom?: string;
    numero?: string;
    voie?: string;
    codePostal?: string;
    commune?: string;
  };
  href?: string;
  isSubscriptionClosed: boolean;
  instructions?: string;
  startHour: string;
  endHour: string;
};
