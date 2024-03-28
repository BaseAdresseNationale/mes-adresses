import { Position } from "../openapi/models/Position";

export enum SignalementTypeEnum {
  LOCATION_TO_UPDATE = "LOCATION_TO_UPDATE",
  LOCATION_TO_CREATE = "LOCATION_TO_CREATE",
  LOCATION_TO_DELETE = "LOCATION_TO_DELETE",
  OTHER = "OTHER",
}

export enum SignalementExistingPositionTypeEnum {
  NUMERO = "NUMERO",
  VOIE = "VOIE",
  TOPONYME = "TOPONYME",
}

export type SignalementAuthor = {
  firstName: string;
  lastName: string;
  email: string;
};

export type SignalementExistingLocation = {
  type: SignalementExistingPositionTypeEnum;
  numero: number;
  suffixe?: string;
  toponyme?: {
    nom: string;
  };
  position?: PositionCoordinates;
  nom?: string;
};

type PositionCoordinates = {
  type: "Point";
  coordinates: number[];
};

export type SignalementChangesRequested = {
  numero: number;
  suffixe?: string;
  positions: {
    position: PositionCoordinates;
    positionType: string;
  }[];
  parcelles: string[];
  nomVoie?: string;
  nom?: string;
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

export type MapedSignalementPosition = {
  _id: string;
  point: PositionCoordinates;
  source: "signalement";
  type: Position.type;
};
