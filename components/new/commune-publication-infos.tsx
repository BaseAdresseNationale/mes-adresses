import { ApiDepotService } from "@/lib/api-depot";
import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { Pane, Spinner } from "evergreen-ui";
import { useEffect, useState } from "react";
import AlertPublishedBALMesAdresses from "./alert-published-bal/alert-published-bal-mes-adresses";
import AlertPublishedBALMoissoneur from "./alert-published-bal/alert-published-bal-moissoneur";
import AlertPublishedBALApiDepot from "./alert-published-bal/alert-published-bal-api-depot";
import {
  BaseLocale,
  BasesLocalesService,
  PageBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import AlertExistingBALMesAdresses from "./alert-published-bal/alert-existing-bal-mes-adresses";
import AlertNoBAL from "./alert-published-bal/alert-no-bal";

interface CommunePublicationInfosProps {
  commune: CommuneType;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
}

function CommunePublicationInfos({
  commune,
  outdatedHarvestSources,
  outdatedApiDepotClients,
}: CommunePublicationInfosProps) {
  const [apiDepotLastRevision, setApiDepotLastRevision] =
    useState<Revision | null>(null);
  const [existingBALCount, setExistingBALCount] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

          {existingBALCount > 0 && (
            <AlertExistingBALMesAdresses
              commune={commune}
              existingBALCount={existingBALCount}
            />
          )}

          {!apiDepotLastRevision && existingBALCount === 0 && (
            <AlertNoBAL commune={commune} />
          )}
        </>
      )}
    </Pane>
  );
}

export default CommunePublicationInfos;
