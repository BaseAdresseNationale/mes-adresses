import Uploader from "@/components/uploader";
import { getFileExtension } from "@/lib/utils/file";
import { CommuneType } from "@/types/commune";
import {
  validate,
  ValidateType,
  ValidateRowFullType,
} from "@ban-team/validateur-bal";
import {
  Alert,
  Button,
  InboxIcon,
  Pane,
  Paragraph,
  Radio,
  RadioGroup,
  ShareIcon,
  Strong,
  Text,
} from "evergreen-ui";
import { Fragment, useState } from "react";
import { uniqBy } from "lodash";

interface ImportDataStepProps {
  commune: CommuneType;
  importValue: string;
  setImportValue: (value: "ban" | "file") => void;
  csvImportFile: File | null;
  setCsvImportFile: (file: File | null) => void;
}

type CommuneRow = {
  code: string;
  nom: string;
};

function extractCommuneCodeFromRow({ parsedValues, additionalValues }): string {
  return (
    parsedValues.commune_insee || additionalValues?.cle_interop?.codeCommune
  );
}

function extractCommuneFromCSV(rows: ValidateRowFullType[]): CommuneRow[] {
  // Get cle_interop and slice it to get the commune's code
  const communes: CommuneRow[] = rows.map(
    ({ parsedValues, additionalValues }) => ({
      code: extractCommuneCodeFromRow({ parsedValues, additionalValues }),
      nom: parsedValues.commune_nom as string,
    })
  );

  return uniqBy(communes, "code");
}

const getImportOptions = (commune: CommuneType) => [
  {
    label: "Partir des données existantes dans la Base Adresse Nationale",
    value: "ban",
    description: (
      <>
        Cette méthode est recommandée dans la plupart des cas. Elle vous permet
        de partir des adresses déjà présentes dans la{" "}
        <a
          href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/carte-base-adresse-nationale?id=${commune.code}`}
          target="_blank"
        >
          Base Adresse Nationale
        </a>{" "}
        (BAN) et de les enrichir avec vos propres données.
      </>
    ),
  },
  {
    label: "Utiliser un fichier CSV au format BAL",
    value: "file",
    description:
      "Cette méthode est recommandée si vous avez déjà un fichier CSV au format BAL.",
  },
];

const MAX_SIZE = 10 * 1024 * 1024;

function ImportDataStep({
  importValue,
  setImportValue,
  csvImportFile,
  setCsvImportFile,
  commune,
}: ImportDataStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<JSX.Element | null>(null);
  const options = getImportOptions(commune);

  const onAlert = (alert: JSX.Element, canCreateBAL?: boolean) => {
    if (!canCreateBAL) {
      setCsvImportFile(null);
    }
    setAlert(alert);
  };

  const onDrop = async ([file]) => {
    setAlert(null);
    if (file) {
      if (getFileExtension(file.name).toLowerCase() !== "csv") {
        return onAlert(
          <Alert title="Une erreur est survenue" intent="danger" marginTop={16}>
            Ce type de fichier n’est pas supporté. Vous devez déposer un fichier
            CSV.
          </Alert>
        );
      }

      try {
        setIsLoading(true);
        // Detect multi communes
        const validationReport: ValidateType = (await validate(file, {
          profile: "1.4",
        })) as ValidateType;
        const communes: CommuneRow[] = extractCommuneFromCSV(
          validationReport.rows
        );
        const invalidRowsCount = validationReport.rows.filter(
          (row) =>
            !row.isValid && extractCommuneCodeFromRow(row) === commune.code
        ).length;

        if (communes.length === 1 && communes[0].code === commune.code) {
          setCsvImportFile(file);
        } else if (communes.length === 1 && communes[0].code !== commune.code) {
          onAlert(
            <Alert
              title="Une erreur est survenue"
              intent="danger"
              marginTop={16}
            >
              Le fichier ne correspond pas à la commune sélectionnée à
              l&apos;étape précédente.
            </Alert>
          );
        } else if (communes.length > 1) {
          onAlert(
            <Alert
              title="Une erreur est survenue"
              intent="danger"
              marginTop={16}
            >
              Le fichier ne doit contenir qu’une seule commune. Veuillez
              vérifier votre fichier.
            </Alert>
          );
        } else {
          onAlert(
            <Alert
              title="Une erreur est survenue"
              intent="danger"
              marginTop={16}
            >
              Aucune commune n&apos;a pu être trouvée.
            </Alert>
          );
        }

        if (invalidRowsCount > 0) {
          onAlert(
            <Alert
              title="Le fichier comporte des erreurs"
              intent="warning"
              marginTop={16}
            >
              <Paragraph marginTop={8}>
                {invalidRowsCount > 1 ? (
                  <>
                    <Strong>
                      {invalidRowsCount} lignes comportent au moins une erreur
                    </Strong>{" "}
                    et ne pourront pas être importées dans votre Base Adresse
                    Locale.
                  </>
                ) : (
                  <>
                    <Strong>1 ligne comporte au moins une erreur</Strong> et ne
                    pourra pas être importée dans votre Base Adresse Locale.
                  </>
                )}
              </Paragraph>

              <Paragraph>
                En continuant, seules les adresses conformes seront utilisées
                pour créer votre Base Adresse Locale.
              </Paragraph>

              <Paragraph>
                Pour obtenir un rapport détaillé des erreurs qui ont été
                détectées, consultez{" "}
                <a
                  href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/bases-locales/validateur`}
                  target="_blank"
                  rel="noreferrer"
                >
                  le validateur de Bases Adresses Locales{" "}
                  <ShareIcon verticalAlign="middle" />
                </a>
                .
              </Paragraph>
            </Alert>,
            true
          );
        }
      } catch (err) {
        console.error(err);
        onAlert(
          <Alert title="Une erreur est survenue" intent="danger" marginTop={16}>
            Une erreur est survenue lors de l’analyse du fichier.
          </Alert>
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onDropRejected = (rejectedFiles) => {
    const [file] = rejectedFiles;

    if (rejectedFiles.length > 1) {
      onAlert(
        <Alert title="Une erreur est survenue" intent="danger" marginTop={16}>
          Vous ne pouvez déposer qu’un seul fichier.
        </Alert>
      );
    } else if (file.size > MAX_SIZE) {
      return onAlert(
        <Alert title="Une erreur est survenue" intent="danger" marginTop={16}>
          Ce fichier est trop volumineux. Vous devez déposer un fichier de moins
          de 10 Mo.
        </Alert>
      );
    } else {
      onAlert(
        <Alert title="Une erreur est survenue" intent="danger" marginTop={16}>
          Impossible de déposer ce fichier.
        </Alert>
      );
    }
  };

  const description = options.find((option) => option.value === importValue)
    ?.description;

  return (
    <>
      <Pane aria-label="Choisissez votre point de départ" role="group">
        <Text fontWeight={500} fontSize="14px" color="gray700">
          Choisissez votre point de départ
        </Text>
        {options.map((option) => (
          <Fragment key={option.value}>
            <Radio
              size={16}
              name="import-option"
              checked={importValue === option.value}
              label={option.label}
              onChange={() => setImportValue(option.value as "ban" | "file")}
            />
            {importValue === option.value && (
              <Alert intent="info" marginBottom={16}>
                <Text>{description}</Text>
              </Alert>
            )}
          </Fragment>
        ))}
      </Pane>

      {importValue === "file" && (
        <Pane>
          <Uploader
            file={csvImportFile}
            maxSize={MAX_SIZE}
            height={150}
            marginBottom={24}
            placeholder="Sélectionnez ou glissez ici votre fichier BAL au format CSV (maximum 10 Mo)"
            loadingLabel="Analyse en cours"
            disabled={isLoading}
            onDrop={onDrop}
            onDropRejected={onDropRejected}
            isLoading={isLoading}
          />
          {alert}

          <Alert
            title="Vous disposez déjà d’une Base Adresse Locale au format CSV gérée à partir d’un autre outil ?"
            marginY={16}
          >
            <Paragraph marginTop={16}>
              Utilisez le formulaire de dépôt afin de publier vos adresses dans
              la Base Adresse Nationale.
            </Paragraph>
            <Pane marginTop={16}>
              <Button
                appearance="primary"
                iconBefore={InboxIcon}
                is="a"
                href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/bases-locales/publication`}
                target="_blank"
              >
                Accéder au formulaire de dépôt
              </Button>
            </Pane>
          </Alert>
        </Pane>
      )}
    </>
  );
}

export default ImportDataStep;
