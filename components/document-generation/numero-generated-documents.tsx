import LocalStorageContext from "@/contexts/local-storage";
import { Numero } from "@/lib/openapi-api-bal";
import { DownloadIcon, Menu, Tooltip } from "evergreen-ui";
import { useContext } from "react";
import {
  DocumentGenerationData,
  GeneratedDocumentType,
} from "./document-generation.types";

interface NumeroGeneratedDocumentsProps<type extends GeneratedDocumentType> {
  setDocumentGenerationData: (data: DocumentGenerationData<type>) => void;
  numero: Numero;
}

export function NumeroGeneratedDocuments<type extends GeneratedDocumentType>({
  setDocumentGenerationData,
  numero,
}: NumeroGeneratedDocumentsProps<type>) {
  const { certificatEmetteur } = useContext(LocalStorageContext);

  let generateCertificatAdressageItem = (
    <Menu.Item
      icon={DownloadIcon}
      disabled={!numero.certifie || numero.parcelles.length === 0}
      onSelect={() =>
        setDocumentGenerationData({
          type: GeneratedDocumentType.CERTIFICAT_ADRESSAGE,
          id: numero.id,
          data: {
            destinataire: "",
            emetteur: certificatEmetteur || "",
            rememberEmetteur: Boolean(certificatEmetteur),
          },
        } as Parameters<typeof setDocumentGenerationData>[0])
      }
    >
      Certificat d&apos;adressage
    </Menu.Item>
  );

  let generateArreteDeNumerotationItem = (
    <Menu.Item
      icon={DownloadIcon}
      disabled={!numero.certifie || numero.parcelles.length === 0}
      onSelect={() =>
        setDocumentGenerationData({
          type: GeneratedDocumentType.ARRETE_DE_NUMEROTATION,
          id: numero.id,
          data: {},
        } as Parameters<typeof setDocumentGenerationData>[0])
      }
    >
      Arrêté de numérotation
    </Menu.Item>
  );

  if (!numero.certifie || numero.parcelles.length === 0) {
    generateCertificatAdressageItem = (
      <Tooltip content="Le certificat d'adressage ne peut être généré que pour un numéro certifié et lié à au moins une parcelle">
        {generateCertificatAdressageItem}
      </Tooltip>
    );
    generateArreteDeNumerotationItem = (
      <Tooltip content="L'arrêté de numérotation ne peut être généré que pour un numéro certifié et lié à au moins une parcelle">
        {generateArreteDeNumerotationItem}
      </Tooltip>
    );
  }

  return (
    <>
      <Menu.Divider />
      <Menu.Group title="Générer un document">
        {generateCertificatAdressageItem}
        {generateArreteDeNumerotationItem}
      </Menu.Group>
    </>
  );
}
