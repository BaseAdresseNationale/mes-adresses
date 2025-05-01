import React, { useContext, useEffect, useMemo, useState } from "react";
import { ApiGeoService } from "../lib/geo-api";
import Main from "../layouts/main";
import { ApiBalAdminService } from "@/lib/bal-admin";
import { BALWidgetConfig } from "@/lib/bal-admin/type";
import Stepper from "@/components/stepper";
import SearchCommuneStep from "@/components/new/steps/search-commune-step";
import ImportDataStep from "@/components/new/steps/import-data-step";
import BALInfosStep from "@/components/new/steps/bal-infos-step";
import { Pane } from "evergreen-ui";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import LocalStorageContext from "@/contexts/local-storage";
import Router from "next/router";
import { useBALDataImport } from "@/hooks/bal-data-import";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";
import styles from "./new.module.css";

interface NewPageProps {
  defaultCommune?: CommuneType;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
}

const getSuggestedBALName = (commune?: CommuneType) => {
  return commune ? `Adresses de ${commune.nom}` : null;
};

function NewPage({
  defaultCommune,
  outdatedApiDepotClients,
  outdatedHarvestSources,
}: NewPageProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { addBalAccess } = useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const [commune, setCommune] = useState<CommuneType | null>(defaultCommune);
  const [importValue, setImportValue] = useState<"ban" | "file">("ban");
  const [csvImportFile, setCsvImportFile] = useState<File | null>(null);
  const [balName, setBalName] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const { importFromCSVFile, importFromBAN } = useBALDataImport();

  useEffect(() => {
    if (commune) {
      setBalName(getSuggestedBALName(commune));
    } else {
      setBalName(null);
    }
  }, [commune]);

  const steps = useMemo(() => {
    return [
      {
        label: "Choix de la commune",
        canBrowseNext: Boolean(commune),
        canBrowseBack: false,
      },
      {
        label: "Import des données",
        canBrowseNext:
          importValue === "file"
            ? Boolean(csvImportFile)
            : Boolean(importValue),
        canBrowseBack: !isLoading,
      },
      {
        label: "Informations sur la BAL",
        canBrowseNext: !isLoading && Boolean(balName) && Boolean(adminEmail),
        canBrowseBack: !isLoading,
      },
    ];
  }, [commune, importValue, csvImportFile, isLoading, balName, adminEmail]);

  const createNewBal = async (isDemo?: boolean) => {
    let bal: BaseLocale;

    setIsLoading(true);

    try {
      if (isDemo) {
        bal = await BasesLocalesService.createBaseLocaleDemo({
          commune: commune.code,
        });
      } else {
        bal = await BasesLocalesService.createBaseLocale({
          nom: balName,
          emails: [adminEmail],
          commune: commune.code,
        });
      }
    } catch (err) {
      pushToast({
        title: "Erreur",
        message:
          "Une erreur est survenue lors de la création de la Base Adresse Locale",
        intent: "danger",
      });
      setIsLoading(false);
      return;
    }

    addBalAccess(bal.id, bal.token);

    try {
      if (importValue === "file") {
        await importFromCSVFile(bal, csvImportFile);
      } else if (importValue === "ban") {
        await importFromBAN(bal);
      }
    } catch (err) {
      pushToast({
        title: "Erreur",
        message:
          "Une erreur est survenue lors de l'importation des données dans la Base Adresse Locale",
        intent: "danger",
      });
      setIsLoading(false);
      return;
    }

    Router.push(`/bal/${bal.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNewBal();
  };

  return (
    <Main>
      <Pane flex={1} is="form" onSubmit={handleSubmit}>
        <Stepper
          steps={steps}
          currentStepIndex={currentStepIndex}
          onStepChange={setCurrentStepIndex}
        >
          <Pane display="flex" height="100%">
            <Pane flex={1} display="flex" flexDirection="column">
              {currentStepIndex === 0 && (
                <SearchCommuneStep
                  commune={commune}
                  setCommune={setCommune}
                  outdatedApiDepotClients={outdatedApiDepotClients}
                  outdatedHarvestSources={outdatedHarvestSources}
                />
              )}
              {currentStepIndex === 1 && (
                <ImportDataStep
                  commune={commune}
                  importValue={importValue}
                  setImportValue={setImportValue}
                  csvImportFile={csvImportFile}
                  setCsvImportFile={setCsvImportFile}
                />
              )}
              {currentStepIndex === 2 && (
                <BALInfosStep
                  balName={balName}
                  setBalName={setBalName}
                  adminEmail={adminEmail}
                  setAdminEmail={setAdminEmail}
                  createDemoBAL={() => createNewBal(true)}
                  isLoading={isLoading}
                />
              )}
            </Pane>
            <Pane className={styles["welcome-illustration"]} />
          </Pane>
        </Stepper>
      </Pane>
    </Main>
  );
}

export async function getServerSideProps({ query }) {
  let defaultCommune = null;
  if (query.commune) {
    defaultCommune = await ApiGeoService.getCommune(query.commune, {
      fields: "departement",
    });
  }
  try {
    const widgetConfig: BALWidgetConfig =
      await ApiBalAdminService.getBALWidgetConfig();
    return {
      props: {
        defaultCommune,
        outdatedApiDepotClients:
          widgetConfig?.communes?.outdatedApiDepotClients || [],
        outdatedHarvestSources:
          widgetConfig?.communes?.outdatedHarvestSources || [],
      },
    };
  } catch {
    return {
      props: {
        defaultCommune,
        outdatedApiDepotClients: [],
        outdatedHarvestSources: [],
      },
    };
  }
}

export default NewPage;
