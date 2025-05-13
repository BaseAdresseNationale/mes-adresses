import { useState, useEffect } from "react";
import { Alert, Button, Paragraph, Spinner } from "evergreen-ui";
import { DataGouvService } from "@/lib/data-gouv/data-gouv";
import { Dataset, Organization } from "@/lib/data-gouv/types";
import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";

interface AlertPublishedBALMoissoneurProps {
  commune: CommuneType;
  revision: Revision;
  outdatedHarvestSources: string[];
}

function AlertPublishedBALMoissoneur({
  revision,
  outdatedHarvestSources,
  commune,
}: AlertPublishedBALMoissoneurProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isOutdatedSource = outdatedHarvestSources.includes(
    revision.context.extras.sourceId
  );

  useEffect(() => {
    const loadOrganization = async () => {
      setIsLoading(true);
      if (revision.context.extras.sourceId) {
        try {
          const sourceId: string = revision.context.extras.sourceId;
          const dataset: Dataset = await DataGouvService.findDataset(sourceId);

          setOrganization(dataset.organization);
        } catch (error) {
          console.error("Error fetching organization:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadOrganization();
  }, [revision]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Alert
      title={`Une Base Adresse Locale a déjà été publiée pour ${commune.nom}`}
      intent={isOutdatedSource ? "info" : "warning"}
      marginTop={16}
    >
      {organization && (
        <>
          <Paragraph marginTop={16}>
            Une Base Adresse Locale est déjà publiée par {organization.name}{" "}
            pour {commune.nom}.
          </Paragraph>
          {!isOutdatedSource && (
            <Paragraph marginTop={16}>
              Nous recommandons de prendre contact avec cet organisme.
            </Paragraph>
          )}
          <Paragraph marginTop={16}>
            <Button
              is="a"
              height={30}
              href={`${organization.page}/information`}
              target="_blank"
            >
              Page data.gouv {organization.name}
            </Button>
          </Paragraph>
        </>
      )}

      {isOutdatedSource && (
        <Paragraph marginTop={16}>
          La Base Adresse Locale publiée est obsolète. Vous pouvez continuer à
          l&apos;étape suivante pour la remplacer par la vôtre.
        </Paragraph>
      )}

      <Paragraph marginTop={16}>
        La commune étant compétente en matière d’adressage, vous pouvez prendre
        la main directement en continuant à l&apos;étape suivante.
      </Paragraph>
    </Alert>
  );
}

export default AlertPublishedBALMoissoneur;
