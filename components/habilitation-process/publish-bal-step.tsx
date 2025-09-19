import { useEffect, useState, useCallback } from "react";
import {
  Pane,
  Heading,
  Alert,
  Text,
  Link,
  Strong,
  UnorderedList,
  ListItem,
  UploadIcon,
  UpdatedIcon,
  Paragraph,
} from "evergreen-ui";

import TextWrapper from "@/components/text-wrapper";
import AuthenticatedUser from "@/components/habilitation-process/authenticated-user";
import { CommuneType } from "@/types/commune";
import { Habilitation, StatusHabilitationEnum } from "@/lib/api-depot/types";
import { ApiDepotService } from "@/lib/api-depot/index";
import { BasesLocalesService } from "@/lib/openapi-api-bal/index";
import { BaseLocale } from "@/lib/openapi-api-bal/models/BaseLocale";

interface PublishBalStepProps {
  baseLocale: BaseLocale;
  commune: CommuneType;
  habilitation: Habilitation;
  handlePublication: () => void;
  isLoadingPublish: boolean;
  setIsLoadingPublish: (isLoading: boolean) => void;
  flagURL: string | null;
}

function PublishBalStep({
  baseLocale,
  commune,
  habilitation,
  handlePublication,
  isLoadingPublish,
  setIsLoadingPublish,
  flagURL,
}: PublishBalStepProps) {
  const [isConflicted, setIsConflicted] = useState(false);

  const checkConflictingRevision = useCallback(async () => {
    try {
      const revisions = await ApiDepotService.getRevisions(commune.code);
      setIsConflicted(revisions.length > 0);
    } catch (error) {
      console.error(
        "ERROR: Impossible de récupérer les révisions pour cette commune",
        error.body
      );
    }
  }, [commune.code]);

  useEffect(() => {
    async function wait() {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    async function publishBAL() {
      setIsLoadingPublish(true);
      if (habilitation?.status === StatusHabilitationEnum.ACCEPTED) {
        checkConflictingRevision();
        // SET RESUME BAL IF HABILITATION CODE
        if (baseLocale.sync?.isPaused == true) {
          await BasesLocalesService.resumeBaseLocale(baseLocale.id);
        }

        await wait();
        // await handlePublication();
      }
      setIsLoadingPublish(false);
    }

    publishBAL();
  }, []);

  return (
    <Pane
      display="flex"
      alignItems="center"
      flexDirection="column"
      background="white"
      padding={16}
      borderRadius={8}
      margin={8}
    >
      {isLoadingPublish && <Paragraph>Publication en cours…</Paragraph>}
    </Pane>
  );
}

export default PublishBalStep;
