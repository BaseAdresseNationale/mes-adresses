import { useState, useEffect } from "react";
import { Button, Paragraph, Spinner } from "evergreen-ui";
import { DataGouvService } from "@/lib/data-gouv/data-gouv";
import {
  Dataset,
  Organization as OrganizationDataGouv,
} from "@/lib/data-gouv/types";
import { Organization as OrganizationMoissonneur } from "@/lib/moissonneur/type";
import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { ApiMoissonneurBalService } from "@/lib/moissonneur";

interface PublishedBALMoissoneurProps {
  commune: CommuneType;
  revision: Revision;
  outdatedHarvestSources: string[];
}

function PublishedBALMoissoneur({
  revision,
  outdatedHarvestSources,
  commune,
}: PublishedBALMoissoneurProps) {
  const [organizationMoissonneur, setOrganizationMoissonneur] =
    useState<OrganizationMoissonneur | null>(null);
  const [organizationDataGouv, setOrganizationDataGouv] =
    useState<OrganizationDataGouv | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isOutdatedSource = outdatedHarvestSources.includes(
    revision.context.extras.sourceId
  );

  useEffect(() => {
    const loadOrganization = async () => {
      setIsLoading(true);
      console.log(revision.context);
      if (revision.context.extras.sourceId) {
        try {
          const sourceId: string = revision.context.extras.sourceId;
          const dataset: Dataset = await DataGouvService.findDataset(sourceId);
          console.log(dataset.organization);
          setOrganizationDataGouv(dataset.organization);
          if (dataset?.organization?.id) {
            const organizationMoissonneur =
              await ApiMoissonneurBalService.getOrganization(
                dataset.organization.id
              );
            console.log(organizationMoissonneur);
            setOrganizationMoissonneur(organizationMoissonneur);
          }
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
    <>
      {organizationDataGouv && (
        <>
          <Paragraph marginTop={16}>
            Une Base Adresse Locale est déjà publiée par{" "}
            {organizationDataGouv.name} pour {commune.nom}.
          </Paragraph>
          {!isOutdatedSource && (
            <Paragraph marginTop={16}>
              Nous recommandons de prendre contact avec cet organisme :{" "}
              {organizationMoissonneur?.email && (
                <b>{organizationMoissonneur.email}</b>
              )}
            </Paragraph>
          )}
          {!organizationMoissonneur?.email && (
            <Paragraph marginTop={16}>
              <Button
                is="a"
                height={30}
                href={organizationDataGouv.page}
                target="_blank"
              >
                Page data.gouv {organizationDataGouv.name}
              </Button>
            </Paragraph>
          )}
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
    </>
  );
}

export default PublishedBALMoissoneur;
