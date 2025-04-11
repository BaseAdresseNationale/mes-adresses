import Uploader from "@/components/uploader";
import { getFileExtension } from "@/lib/utils/file";
import { CommuneType } from "@/types/commune";
import {
  validate,
  ValidateProfile,
  ValidateRowType,
} from "@ban-team/validateur-bal";
import { RadioGroup } from "evergreen-ui";
import { useState } from "react";
import { uniqBy } from "lodash";

interface ImportDataStepProps {
  commune: CommuneType;
  importValue: string;
  setImportValue: (value: "ban" | "file" | "empty") => void;
  csvImportFile: File | null;
  setCsvImportFile: (file: File | null) => void;
  options: {
    label: string;
    value: string;
  }[];
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

function extractCommuneFromCSV(rows: ValidateRowType[]): CommuneRow[] {
  // Get cle_interop and slice it to get the commune's code
  const communes: CommuneRow[] = rows.map(
    ({ parsedValues, additionalValues }) => ({
      code: extractCommuneCodeFromRow({ parsedValues, additionalValues }),
      nom: parsedValues.commune_nom as string,
    })
  );

  return uniqBy(communes, "code");
}

const MAX_SIZE = 10 * 1024 * 1024;

function ImportDataStep({
  importValue,
  setImportValue,
  csvImportFile,
  setCsvImportFile,
  options,
  commune,
}: ImportDataStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onError = (error) => {
    setCsvImportFile(null);
    setError(error);
  };

  const onDrop = async ([file]) => {
    setError(null);
    if (file) {
      if (getFileExtension(file.name).toLowerCase() !== "csv") {
        return onError(
          "Ce type de fichier n’est pas supporté. Vous devez déposer un fichier CSV."
        );
      }

      // Detect multi communes
      const validationReport: ValidateProfile = (await validate(file, {
        profile: "1.3-relax",
      })) as ValidateProfile;
      const communes: CommuneRow[] = extractCommuneFromCSV(
        validationReport.rows
      );

      if (communes.length === 1 && communes[0].code === commune.code) {
        setCsvImportFile(file);
      } else {
        onError("Aucune commune n’a pu être trouvée.");
      }
    }
  };

  const onDropRejected = (rejectedFiles) => {
    const [file] = rejectedFiles;

    if (rejectedFiles.length > 1) {
      onError("Vous ne pouvez déposer qu’un seul fichier.");
    } else if (file.size > MAX_SIZE) {
      return onError(
        "Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 10 Mo."
      );
    } else {
      onError("Impossible de déposer ce fichier");
    }
  };

  return (
    <>
      <RadioGroup
        label="Importer les données"
        size={16}
        value={importValue}
        options={options}
        onChange={(event) =>
          setImportValue(event.target.value as "ban" | "file" | "empty")
        }
      />
      {importValue === "file" && (
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
      )}
    </>
  );
}

export default ImportDataStep;
