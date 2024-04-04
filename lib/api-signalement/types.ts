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

type PositionCoordinates = {
  type: "Point";
  coordinates: number[];
};

export type MapedSignalementPosition = {
  _id: string;
  point: PositionCoordinates;
  source: "signalement";
  type: Position.type;
};
