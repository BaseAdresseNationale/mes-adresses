import {
  Dialog,
  Pane,
  FileUploader,
  FileCard,
  MimeType,
  IconButton,
  CameraIcon,
  Text,
} from "evergreen-ui";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  DocumentGenerationData,
  GeneratedDocumentType,
} from "./document-generation.types";
import { MouseEvent } from "react";
import MapContext from "@/contexts/map";
import type { LngLatBoundsLike, Map } from "maplibre-gl";
import { bboxForVoie, resetMapFilter, setMapFilter } from "@/lib/utils/map";
import {
  mapLayersIds,
  NUMEROS_LABEL,
  NUMEROS_POINT,
  TOPONYME_LABEL,
  VOIE_LABEL,
  VOIE_TRACE_LINE,
  ZOOM,
} from "../map/layers/tiles";
import { Numero, Voie } from "@/lib/openapi-api-bal";
import { ViewState } from "react-map-gl";

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
  const { map, setViewport } = useContext(MapContext);
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

  const handleTakeScreenshot = async (e: MouseEvent) => {
    e.stopPropagation();

    function resetMapAfterScreenshot(map: Map) {
      resetMapFilter(map);
      map.setLayerZoomRange(
        NUMEROS_LABEL,
        ZOOM.NUMEROS_ZOOM.maxZoom,
        undefined
      );
    }

    async function prepareMapBeforeScreenshot(map: Map) {
      return new Promise<void>((resolve) => {
        const voieId = (data?.for as Numero).voieId || data.for.id;
        if (!voieId) {
          return;
        }

        // Hide the other layers
        setMapFilter(map, VOIE_TRACE_LINE, ["==", ["get", "id"], "hideLayer"]);
        setMapFilter(map, NUMEROS_POINT, ["==", ["get", "id"], "hideLayer"]);
        setMapFilter(map, VOIE_LABEL, ["==", ["get", "id"], "hideLayer"]);
        setMapFilter(map, TOPONYME_LABEL, ["==", ["get", "id"], "hideLayer"]);

        // Show only the selected voie and its numeros
        setMapFilter(map, NUMEROS_LABEL, ["==", ["get", "idVoie"], voieId]);

        map.setLayerZoomRange(NUMEROS_LABEL, 0, 20);

        // If the selected item is a numero, zoom to it
        if ((data?.for as Numero).voieId) {
          map.flyTo({
            center: [
              (data?.for as Numero).positions[0].point.coordinates[0],
              (data?.for as Numero).positions[0].point.coordinates[1],
            ],
            zoom: 18,
            animate: false,
          });
        }
        // If the selected item is a voie, zoom to its bbox or centroid
        else {
          const bounds = bboxForVoie(data?.for as Voie, map);
          const camera = map.cameraForBounds(bounds as LngLatBoundsLike, {
            padding: 100,
          });
          setViewport((viewport: ViewState) => ({
            ...viewport,
            bearing: camera.bearing,
            longitude: (camera.center as any).lng,
            latitude: (camera.center as any).lat,
            zoom: camera.zoom,
          }));
        }
        map.once("idle", () => resolve());
      });
    }

    function dataURItoBlob(dataURI) {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    }

    function getImageBase64(map): Promise<string> {
      return new Promise((resolve) => {
        map.once("render", () =>
          resolve(
            (map.getCanvas() as HTMLCanvasElement).toDataURL("image/jpeg", 0.8)
          )
        );
        map.setBearing(map.getBearing());
      });
    }

    try {
      if (!map) {
        return;
      }

      await prepareMapBeforeScreenshot(map);
      const imageBase64: string = await getImageBase64(map);
      const blob = dataURItoBlob(imageBase64);
      const file = new File([blob], `plan-de-situation.jpeg`, {
        type: "image/jpeg",
      });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      resetMapAfterScreenshot(map);
      setFiles([file]);
      setFileRejections([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    await onDownload(data.for.id, {
      file: files[0],
    });
    setIsLoading(false);
    setData(null);
    handleReset();
  };

  return (
    <Dialog
      isShown={data?.type === GeneratedDocumentType.ARRETE_DE_NUMEROTATION}
      title="Télécharger un modèle d'arrêté de numérotation"
      cancelLabel="Annuler"
      confirmLabel="Générer"
      onCloseComplete={() => setData(null)}
      onCancel={() => setData(null)}
      isConfirmLoading={isLoading}
      isConfirmDisabled={isLoading || fileRejections.length > 0}
      shouldCloseOnOverlayClick={!isLoading}
      shouldCloseOnEscapePress={!isLoading}
      hasCancel={!isLoading}
      hasClose={!isLoading}
      onConfirm={handleConfirm}
    >
      <Pane is="form" onSubmit={(e) => e.preventDefault()}>
        <FileUploader
          label="Plan de situation (optionnel)"
          description="Le plan de situation fourni sera inséré dans l'arrêté de numérotation"
          browseOrDragText={() => (
            <Pane
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={10}
            >
              <Text>
                Sélectionner le fichier (Format PNG et JPEG, maximum 5 Mo)
              </Text>
              <Pane>
                <Text>
                  Ou cliquer sur{" "}
                  <IconButton
                    marginLeft={8}
                    marginRight={8}
                    height={29}
                    width={29}
                    icon={CameraIcon}
                    title="Prendre une photo de la carte"
                    onClick={handleTakeScreenshot}
                  />
                  pour générer le plan de situation automatiquement
                </Text>
              </Pane>
            </Pane>
          )}
          maxSizeInBytes={5 * 1024 ** 2}
          acceptedMimeTypes={[MimeType.png, MimeType.jpeg]}
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
