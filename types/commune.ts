export type CommmuneType = {
  nom: string;
  code: string;
  departement: {
    code: string;
    nom: string;
  };
  isCOM: boolean;
  hasCadastre: boolean;
  contour: {
    type: string;
    coordinates: number[][][];
  };
  hasOpenMapTiles: boolean;
  hasOrtho: boolean;
  hasPlanIGN: boolean;
}
