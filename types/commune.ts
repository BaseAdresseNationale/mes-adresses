export type CommmuneType = {
  nom: string;
  code: string;
  departement: {
    code: string;
    nom: string;
  };
  isCOM: boolean;
  hasCadastre: boolean;
}
