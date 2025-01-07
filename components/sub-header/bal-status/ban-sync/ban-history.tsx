import { useState, useEffect } from "react";
import {
  Pane,
  Heading,
  Button,
  Text,
  Icon,
  HistoryIcon,
  Spinner,
} from "evergreen-ui";

import { ApiDepotService } from "@/lib/api-depot";

import Revision from "@/components/sub-header/bal-status/ban-sync/ban-history/revision";
import { Revision as RevisionType } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { BaseLocaleSync } from "@/lib/openapi-api-bal";

interface BANHistoryProps {
  baseLocaleId: string;
  syncStatus: BaseLocaleSync.status;
  commune: CommuneType;
}

function BANHistory({ baseLocaleId, syncStatus, commune }: BANHistoryProps) {
  const [revisions, setRevisions] = useState<RevisionType[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLimited, setIsLimited] = useState(true);

  useEffect(() => {
    async function fetchRevision() {
      const revisions = await ApiDepotService.getRevisions(commune.code);
      const publishedRevisions = revisions
        .filter((r) => r.status === "published")
        .reverse(); // Sort by date

      setRevisions(publishedRevisions);
      setIsLoading(false);
    }

    setIsLoading(true);
    fetchRevision();
  }, [commune.code, syncStatus]);

  return (
    <Pane marginY={8}>
      <Heading is="h3" display="flex" alignItems="center" marginY={8}>
        Historique de mise à jour <Icon icon={HistoryIcon} marginLeft={4} />
      </Heading>

      {isLoading ? (
        <Pane display="flex">
          <Spinner marginRight={8} size={22} />
          <Text fontStyle="italic">Chargement de l’historique</Text>
        </Pane>
      ) : (
        <>
          <Pane overflowY="scroll" maxHeight={500}>
            {revisions.length > 0 ? (
              <Pane
                display="flex"
                flexDirection="column"
                justifyContent="center"
                gap={4}
              >
                {revisions
                  .slice(0, isLimited ? 3 : revisions.length)
                  .map((revision) => (
                    <Revision
                      key={revision._id}
                      commune={commune}
                      baseLocaleId={baseLocaleId}
                      revision={revision}
                    />
                  ))}
              </Pane>
            ) : (
              <Text color="muted">Aucune Base Adresses Locales trouvée</Text>
            )}
          </Pane>

          {revisions.length > 3 && (
            <Pane display="flex" justifyContent="center">
              <Button
                appearance="minimal"
                marginTop={8}
                onClick={() => setIsLimited((isLimited) => !isLimited)}
              >
                {isLimited ? "Afficher tout l’historique" : "Réduire"}
              </Button>
            </Pane>
          )}
        </>
      )}
    </Pane>
  );
}

export default BANHistory;
