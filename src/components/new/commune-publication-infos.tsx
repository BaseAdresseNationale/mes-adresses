import { ApiDepotService } from "@/lib/api-depot";
import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { Button, LabTestIcon, Link, Pane, Spinner, Text } from "evergreen-ui";
import { useEffect, useState } from "react";
import AlertPublishedBALMesAdresses from "./alert-published-bal/alert-published-bal-mes-adresses";
import AlertPublishedBALMoissoneur from "./alert-published-bal/alert-published-bal-moissoneur";
import AlertPublishedBALApiDepot from "./alert-published-bal/alert-published-bal-api-depot";
import {
  BaseLocale,
  BasesLocalesService,
  PageBaseLocaleDTO,
} from "@/lib/openapi-api-bal";

interface CommunePublicationInfosProps {
  commune: CommuneType;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
  onCreateNewBAL: (isDemoForce?: boolean) => void;
}

function CommunePublicationInfos({
  commune,
  outdatedHarvestSources,
  outdatedApiDepotClients,
  onCreateNewBAL,
}: CommunePublicationInfosProps) {
  const [apiDepotLastRevision, setApiDepotLastRevision] =
    useState<Revision | null>(null);
  const [existingBALCount, setExistingBALCount] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isLoading && !apiDepotLastRevision && existingBALCount === 0) {
      onCreateNewBAL();
    }
  }, [apiDepotLastRevision, existingBALCount, isLoading, onCreateNewBAL]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const draftResponse: PageBaseLocaleDTO =
          await BasesLocalesService.searchBaseLocale(
            "1",
            "0",
            "false",
            commune.code,
            undefined,
            BaseLocale.status.DRAFT
          );
        const draftCount = draftResponse.count;

        const replacedResponse: PageBaseLocaleDTO =
          await BasesLocalesService.searchBaseLocale(
            "1",
            "0",
            "false",
            commune.code,
            undefined,
            BaseLocale.status.REPLACED
          );
        const replacedCount = replacedResponse.count;

        setExistingBALCount(draftCount + replacedCount);
      } catch (error) {
        console.error("Error fetching existing BAL count:", error);
      }
      try {
        const revision: Revision = await ApiDepotService.getCurrentRevision(
          commune.code
        );
        setApiDepotLastRevision(revision);
      } catch (error) {
        console.error("Error fetching API Depot last revision:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setApiDepotLastRevision(null);
    setExistingBALCount(0);
    setIsLoading(false);
    void fetchData();
  }, [commune]);

  return (
    <Pane>
      {isLoading ? (
        <Pane display="flex" alignItems="center" justifyContent="center">
          <Spinner />
        </Pane>
      ) : (
        <>
          {apiDepotLastRevision ? (
            apiDepotLastRevision.context.extras?.balId ? (
              <AlertPublishedBALMesAdresses
                commune={commune}
                revision={apiDepotLastRevision}
              />
            ) : apiDepotLastRevision.context.extras?.sourceId ? (
              <AlertPublishedBALMoissoneur
                commune={commune}
                revision={apiDepotLastRevision}
                outdatedHarvestSources={outdatedHarvestSources}
              />
            ) : (
              <AlertPublishedBALApiDepot
                commune={commune}
                revision={apiDepotLastRevision}
                outdatedApiDepotClients={outdatedApiDepotClients}
              />
            )
          ) : null}

          {!apiDepotLastRevision?.context.extras?.balId ? (
            <Button marginTop={16} intent="none" onClick={onCreateNewBAL}>
              Créer une nouvelle Base Adresse Locale
            </Button>
          ) : (
            <>
              <Text is="div" color="muted" marginTop={16}>
                Si vous rencontrer un problème vous pouvez contacter notre
                support:{" "}
                <Link href="mailto:adresse@data.gouv.fr">
                  adresse@data.gouv.fr
                </Link>
              </Text>
              <Button
                marginTop={32}
                intent="none"
                onClick={onCreateNewBAL}
                iconAfter={LabTestIcon}
              >
                Créer une Base Adresse Locale de démonstration
              </Button>
              <Text is="div" color="muted" marginTop={8}>
                Cette BAL ne pourra jamais être publiée et ne sera pas
                sauvegardée
              </Text>
            </>
          )}
        </>
      )}
    </Pane>
  );
}

export default CommunePublicationInfos;
