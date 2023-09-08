export type VoieType = {
  _id: string;
  nom: string;
  nomAlt: string;
  _bal: string;
  code: string;
  commune: string;
  _created: string;
  _updated: string;
  centroid: {
    type: string;
    properties: any;
    geometry: {
      type: string;
      coordinates: number[];
    };
  };
  centroidTiles: string[];
  traceTiles: string[];
  nbNumeros: number;
  nbNumerosCertifies: number;
  isAllCertified: boolean;
  commentedNumeros: any[];
  bbox: number[];
}
