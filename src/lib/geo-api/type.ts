export type CommuneApiGeoType = {
  nom: string;
  code: string;
  departement?: {
    code: string;
    nom: string;
  };
  contour?: {
    type: "Polygon";
    coordinates: number[][][];
  };
  codeDepartement?: string;
  codeEpci?: string;
  codeRegion?: string;
  codesPostaux?: string[];
  population?: number;
  siren?: string;
  _score: number;
};

export type CommuneDelegueeApiGeoType = {
  nom: string;
  code: string;
  chefLieu: string;
  type: string;
};
