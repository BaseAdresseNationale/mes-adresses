import { Dialog, Pane, FileUploader, FileCard, MimeType } from "evergreen-ui";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  DocumentGenerationData,
  GeneratedDocumentType,
} from "./numero-generated-documents";

interface GenerateArreteDeNumerotationDialogProps<
  type extends GeneratedDocumentType,
> {
  data: DocumentGenerationData<type> | null;
  setData: Dispatch<SetStateAction<DocumentGenerationData<type> | null>>;
  onDownload: (numeroId: string, data: { file?: Blob }) => Promise<void>;
}

export function GenerateArreteDeNumerotationDialog<
  type extends GeneratedDocumentType,
>({
  data,
  setData,
  onDownload,
}: GenerateArreteDeNumerotationDialogProps<type>) {
  const [files, setFiles] = useState([]);
  const [fileRejections, setFileRejections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((files) => setFiles([files[0]]), []);

  const handleRejected = useCallback(
    (fileRejections) => setFileRejections([fileRejections[0]]),
    []
  );

  const handleReset = useCallback(() => {
    setFiles([]);
    setFileRejections([]);
  }, []);

  const handleConfirm = async () => {
    if (files[0]) {
      setIsLoading(true);
      await onDownload(data.numeroId, {
        file: files[0],
      });
      setIsLoading(false);
      setData(null);
      handleReset();
    }
  };

  return (
    <Dialog
      isShown={data?.type === GeneratedDocumentType.ARRETE_DE_NUMEROTATION}
      title="Génération d'un arrêté de numérotation"
      cancelLabel="Annuler"
      confirmLabel="Générer"
      onCloseComplete={() => setData(null)}
      onCancel={() => setData(null)}
      isConfirmLoading={isLoading}
      isConfirmDisabled={!files[0] || isLoading || fileRejections.length > 0}
      shouldCloseOnOverlayClick={!isLoading}
      shouldCloseOnEscapePress={!isLoading}
      hasCancel={!isLoading}
      hasClose={!isLoading}
      onConfirm={handleConfirm}
    >
      <Pane is="form" onSubmit={(e) => e.preventDefault()}>
        <FileUploader
          label="Plan de situation (Format PNG, maximum 5 Mo)"
          description="Pour créer le plan du situation, vous pouvez utiliser la fonctionnalité de photographie en haut à droite de la carte."
          browseOrDragText={() =>
            "Glissez-déposez ou cliquez pour sélectionner le fichier"
          }
          isRequired
          maxSizeInBytes={5 * 1024 ** 2}
          acceptedMimeTypes={[MimeType.png]}
          maxFiles={1}
          onChange={handleChange}
          onRejected={handleRejected}
          renderFile={(file) => {
            const { name, size, type } = file;
            const fileRejection = fileRejections.find(
              (fileRejection) => fileRejection.file === file
            );
            const { message } = fileRejection || {};
            return (
              <FileCard
                key={name}
                isInvalid={fileRejection != null}
                name={name}
                onRemove={handleReset}
                disabled={isLoading}
                sizeInBytes={size}
                type={type}
                validationMessage={message}
              />
            );
          }}
          values={files}
        />
      </Pane>
    </Dialog>
  );
}
