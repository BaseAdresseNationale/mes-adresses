import {PositionType} from './position'

export type ToponymeType = {
  _id: string;
  nom: string;
  nomAlt: string;
  positions: PositionType[];
  _bal: string;
  commune: string;
  parcelles: any[];
  _created: string;
  _updated: string;
  nbNumeros: number;
  nbNumerosCertifies: number;
  isAllCertified: boolean;
  commentedNumeros: any[];
  bbox: number[];
}
