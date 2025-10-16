import {
  Pane,
  Heading,
  Link,
  DownloadIcon,
  Checkbox,
  Alert,
  Text,
} from "evergreen-ui";
import { useContext, useState } from "react";
import {
  BaseLocale,
  BasesLocalesService,
  ExportCsvService,
} from "@/lib/openapi-api-bal";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";

interface DownloadsProps {
  baseLocaleId: string;
}

function Downloads({ baseLocaleId }: DownloadsProps) {
  const { token } = useContext(TokenContext);
  const { baseLocale } = useContext(BalDataContext);
  const [withComment, setWithComment] = useState(false);

  const downloadFile = (file: string, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const downloadBalCsv = async () => {
    const file = await ExportCsvService.getCsvBal(withComment, baseLocaleId);
    downloadFile(file, "bal.csv");
  };

  const downloadVoieCsv = async () => {
    const file = await ExportCsvService.getCsvVoies(baseLocaleId);
    downloadFile(file, "liste-des-voies.csv");
  };

  const downloadVoieGeoJSON = async () => {
    const file =
      await BasesLocalesService.findFilairesVoiesGeoJson(baseLocaleId);
    downloadFile(JSON.stringify(file), "liste-des-filaires-de-voie.geojson");
  };

  return (
    <Pane>
      <Pane
        flexShrink={0}
        elevation={0}
        background="white"
        padding={16}
        display="flex"
        alignItems="center"
        minHeight={64}
      >
        <Pane display="flex" alignItems="center">
          <DownloadIcon />
          <Heading paddingLeft={5}>Téléchargements</Heading>
        </Pane>
      </Pane>
      <Pane is="ul" display="flex" flexDirection="column" overflowY="scroll">
        <Pane is="li" marginBottom={16}>
          <Pane display="flex" alignItems="center">
            <Link
              style={{ cursor: "pointer" }}
              onClick={downloadBalCsv}
              marginRight={12}
            >
              Base Adresse Locale (format CSV)
            </Link>
            {token && (
              <>
                <Checkbox
                  checked={withComment}
                  onChange={(e) => setWithComment(e.target.checked)}
                  margin={0}
                />
                <Text marginLeft={6}>Avec commentaires</Text>
              </>
            )}
          </Pane>
          {withComment && (
            <Alert marginLeft={-30} marginRight={10} hasIcon={false}>
              <Text is="p" textAlign="center">
                Attention, si vous avez renseigné des informations à caractère
                personnel dans vos commentaires, celles-ci seront présentes dans
                l’export de votre Base Adresse Locale.
              </Text>
            </Alert>
          )}
        </Pane>
        <Pane is="li" marginBottom={16}>
          <Link style={{ cursor: "pointer" }} onClick={downloadVoieCsv}>
            Liste des voies (format CSV)
          </Link>
        </Pane>
        <Pane is="li" marginBottom={16}>
          <Link style={{ cursor: "pointer" }} onClick={downloadVoieGeoJSON}>
            Liste des filaires de voie (format GeoJSON)
          </Link>
        </Pane>
        {token && baseLocale.status === BaseLocale.status.PUBLISHED && (
          <Pane is="li" marginBottom={16}>
            <Text>
              Pour télécharger un certificat de numérotage, rendez-vous dans la
              liste des numéros d&apos;une voie et ouvrez le menu d&apos;actions
              du numéro concerné.
            </Text>
          </Pane>
        )}
      </Pane>
    </Pane>
  );
}

export default Downloads;
