import { useCallback, useEffect, useState } from "react";

import { Alert, Pane, Spinner, Text } from "evergreen-ui";
import {
  BaseLocale,
  HabilitationDTO,
  StrategyDTO,
} from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";
import { ApiDepotService } from "@/lib/api-depot/index";

interface PublishBalStepProps {
  baseLocale: BaseLocale;
  habilitation: HabilitationDTO;
  commune: CommuneType;
  handlePublication: () => void;
  isLoadingPublish: boolean;
  flagURL: string;
  handleClose: () => void;
}

function PublishBalStep({
  baseLocale,
  habilitation,
  commune,
  handlePublication,
  isLoadingPublish,
  flagURL,
  handleClose,
}: PublishBalStepProps) {
  const [isConflicted, setIsConflicted] = useState(false);

  // // Checks revisions to warn of a conflict
  const checkConflictingRevision = useCallback(async () => {
    try {
      const revisions = await ApiDepotService.getRevisions(commune.code);
      // const conflicted = revisions.length > 0;
      const conflicted = false;
      setIsConflicted(conflicted);
      if (!conflicted) {
        handlePublication();
      }
    } catch (error) {
      console.error(
        "ERROR: Impossible de récupérer les révisions pour cette commune",
        error.body
      );
    }
  }, [commune.code, handlePublication]);

  useEffect(() => {
    if (baseLocale.sync) {
      // Skip publication step when renewing accreditation
      handleClose();
    } else {
      checkConflictingRevision();
    }
  }, [baseLocale.sync, handleClose, checkConflictingRevision]);

  return (
    <Pane>
      {isLoadingPublish && (
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap={16}
          padding={16}
          borderRadius={8}
        >
          <Spinner size={42} />
          <Text>Publication en cours...</Text>
        </Pane>
      )}
      {isConflicted && (
        <Alert intent="danger" title="Publication en conflit">
          <Text>Publication en conflit</Text>
        </Alert>
      )}
    </Pane>
  );
}

export default PublishBalStep;
