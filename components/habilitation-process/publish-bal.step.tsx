import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  Pane,
  Strong,
  Spinner,
  Text,
  Link,
  Button,
  Image,
} from "evergreen-ui";
import {
  BaseLocale,
  HabilitationDTO,
  StrategyDTO,
} from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";
import { ApiDepotService } from "@/lib/api-depot/index";
import TextWrapper from "../text-wrapper";

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

  const forcePublication = useCallback(async () => {
    setIsConflicted(false);
    handlePublication();
  }, [handlePublication]);

  // Checks revisions to warn of a conflict
  const checkConflictingRevision = useCallback(async () => {
    try {
      const revisions = await ApiDepotService.getRevisions(commune.code);
      const conflicted = revisions.length > 0;
      // const conflicted = false;
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
    console.log("baseLocale.sync", baseLocale.sync);
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
        <Pane display="flex" flexDirection="column" gap={16}>
          <Alert
            intent="danger"
            title="Cette commune possède déjà une Base Adresse Locale"
            marginTop={16}
            width="100%"
          >
            <Text is="div" color="muted" marginTop={16}>
              Une autre Base Adresses Locale est{" "}
              <Strong>déjà synchronisée avec la Base Adresses Nationale</Strong>
              .
            </Text>
            <Text is="div" color="muted" marginTop={8}>
              En choisissant de publier, cette Base Adresse Locale{" "}
              <Strong>remplacera celle actuellement en place</Strong>.
            </Text>
            <Text is="div" color="muted" marginTop={8}>
              Nous vous recommandons{" "}
              <Strong>
                d’entrer en contact avec les administrateurs de l’autre Base
                Adresses Locale
              </Strong>{" "}
              ou notre support:{" "}
              <Link href="mailto:adresse@data.gouv.fr">
                adresse@data.gouv.fr
              </Link>
            </Text>
          </Alert>

          <Pane
            width="100%"
            textAlign="center"
            borderRadius={8}
            backgroundColor="white"
          >
            <Image
              src="/static/images/schema_bal_conflict.png"
              width="100%"
              maxWidth={800}
              overflow="hidden"
              alt="Schema du conflit entre la Base Adresse Locale et la Base Adresse Nationale"
            />
          </Pane>

          <Pane
            display="flex"
            flexDirection="row"
            justifyContent="end"
            gap={16}
          >
            <Button intent="primary" onClick={handleClose}>
              Fermer
            </Button>
            <Button
              intent="danger"
              appearance="primary"
              onClick={forcePublication}
            >
              Forcer la publication
            </Button>
          </Pane>
        </Pane>
      )}
    </Pane>
  );
}

export default PublishBalStep;
