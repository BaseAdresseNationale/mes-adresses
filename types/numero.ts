import {VoieType} from './voie'

export type PositionType = {
  source: string;
  type: string;
  point: {
    type: string;
    coordinates: number[];
  };
}

export type NumeroType = {
  _id: string;
  numero: number;
  numeroComplet: string;
  suffixe?: string;
  positions: PositionType[];
  tiles: string[];
  comment: string;
  certifie: boolean;
  commune: string;
  toponyme?: string;
  voie: VoieType;
  _created: string;
  _updated: string;
}

