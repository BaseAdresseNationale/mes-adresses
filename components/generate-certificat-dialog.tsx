import { GenerateCertificatDTO } from "@/lib/openapi-api-bal";
import { Dialog, Pane, TextInputField, Checkbox } from "evergreen-ui";
import { Dispatch, SetStateAction, useState } from "react";

export type CertificatGenerationData = GenerateCertificatDTO & {
  numeroId: string;
  rememberEmetteur?: boolean;
};

interface GenerateCertificatDialogProps {
  certificatGenerationData: CertificatGenerationData | null;
  setCertificatGenerationData: Dispatch<
    SetStateAction<CertificatGenerationData | null>
  >;
  onDownloadCertificat: (data: CertificatGenerationData) => Promise<void>;
}

export function GenerateCertificatDialog({
  certificatGenerationData,
  setCertificatGenerationData,
  onDownloadCertificat,
}: GenerateCertificatDialogProps) {
  const [isGeneratingCertificat, setIsGeneratingCertificat] = useState(false);
  return (
    <Dialog
      isShown={certificatGenerationData !== null}
      title="Génération d'un certificat d'adressage"
      cancelLabel="Annuler"
      confirmLabel="Télécharger"
      onCloseComplete={() => setCertificatGenerationData(null)}
      onCancel={() => setCertificatGenerationData(null)}
      isConfirmLoading={isGeneratingCertificat}
      isConfirmDisabled={
        !certificatGenerationData?.emetteur || isGeneratingCertificat
      }
      shouldCloseOnOverlayClick={!isGeneratingCertificat}
      shouldCloseOnEscapePress={!isGeneratingCertificat}
      hasCancel={!isGeneratingCertificat}
      hasClose={!isGeneratingCertificat}
      onConfirm={async () => {
        if (certificatGenerationData) {
          setIsGeneratingCertificat(true);
          await onDownloadCertificat(certificatGenerationData);
          setIsGeneratingCertificat(false);
          setCertificatGenerationData(null);
        }
      }}
    >
      <Pane is="form" onSubmit={(e) => e.preventDefault()}>
        <TextInputField
          label="Émetteur"
          description="L'émetteur sera mentionné dans le certificat d'adressage"
          required
          value={certificatGenerationData?.emetteur || ""}
          onChange={(e) =>
            setCertificatGenerationData(
              (data) =>
                ({
                  ...data,
                  emetteur: e.target.value,
                }) as CertificatGenerationData
            )
          }
          placeholder="Sylvie Loiseau, Adjointe au Maire"
        />
        <Checkbox
          label="Se souvenir de l'émetteur"
          checked={certificatGenerationData?.rememberEmetteur || false}
          onChange={(e) =>
            setCertificatGenerationData(
              (data) =>
                ({
                  ...data,
                  rememberEmetteur: (e.target as HTMLInputElement).checked,
                }) as CertificatGenerationData
            )
          }
          marginBottom={16}
        />
        <TextInputField
          label="Destinataire"
          description="Renseigner le nom du destinataire pour un certificat nominatif"
          value={certificatGenerationData?.destinataire || ""}
          onChange={(e) =>
            setCertificatGenerationData(
              (data) =>
                ({
                  ...data,
                  destinataire: e.target.value,
                }) as CertificatGenerationData
            )
          }
          placeholder="Mr Rémi Dupont"
        />
      </Pane>
    </Dialog>
  );
}
