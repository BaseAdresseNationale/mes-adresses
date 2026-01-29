import { Numero, Voie } from "@/lib/openapi-api-bal";
import { CertificatGenerationData } from "./generate-certificat-dialog";

export enum GeneratedDocumentType {
  CERTIFICAT_ADRESSAGE = "CERTIFICAT_ADRESSAGE",
  ARRETE_DE_NUMEROTATION = "ARRETE_DE_NUMEROTATION",
}

export type DocumentGenerationData<type extends GeneratedDocumentType> = {
  type: GeneratedDocumentType;
  for: Numero | Voie;
  data: type extends GeneratedDocumentType.CERTIFICAT_ADRESSAGE
    ? CertificatGenerationData
    : type extends GeneratedDocumentType.ARRETE_DE_NUMEROTATION
      ? { file?: Blob }
      : never;
};
