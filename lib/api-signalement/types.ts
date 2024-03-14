export enum SignalementTypeEnum {
  LOCATION_TO_UPDATE = "LOCATION_TO_UPDATE",
  LOCATION_TO_CREATE = "LOCATION_TO_CREATE",
  OTHER = "OTHER",
}

export type SignalementAuthor = {
  firstName: string;
  lastName: string;
  email: string;
};

export type SignalementExistingLocation = {
  type: "NUMERO" | "VOIE" | "TOPONYME";
  numero: number;
  suffixe?: string;
  toponyme?: {
    nom: string;
  };
};

export type SignalementChangesRequested = {
  numero: number;
  suffixe?: string;
  positions: {
    position: { type: "Point"; coordinates: number[] };
    positionType: string;
  }[];
  parcelles: string[];
  nomVoie: string;
};

export type Signalement = {
  _id?: string;
  _created: Date;
  _updated: Date;
  _deleted?: Date;
  codeCommune: string;
  type: SignalementTypeEnum;
  author?: SignalementAuthor;
  existingLocation?: SignalementExistingLocation;
  changesRequested: SignalementChangesRequested;
  processedAt?: Date;
};
