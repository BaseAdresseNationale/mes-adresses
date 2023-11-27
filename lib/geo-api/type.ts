export type CommuneApiGeoType = {
  nom: string;
  code: string;
  departement?: {
    code: string;
    nom: string;
  };
  contour?: {
    type: string;
    coordinates: number[][][];
  };
  codeDepartement?: string;
  codeEpci?: string;
  codeRegion?: string;
  codesPostaux?: string[];
  population?: number;
  siren?: string;
}