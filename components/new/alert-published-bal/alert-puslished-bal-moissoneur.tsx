import { useState, useEffect } from "react";
import { Button, Pane, Paragraph } from "evergreen-ui";
import { DataGouvService } from "@/lib/data-gouv/data-gouv";
import { Dataset, Organization } from "@/lib/data-gouv/types";
import { Revision } from "@/lib/api-depot/types";

interface AlertPublishedBALMoissoneurProps {
  revision: Revision;
}

function AlertPublishedBALMoissoneur({
  revision,
}: AlertPublishedBALMoissoneurProps) {
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    const loadOrganization = async () => {
      if (revision.context.extras.sourceId) {
        const sourceId: string = revision.context.extras.sourceId;
        const id: string[] = sourceId.split("-");
        const dataset: Dataset = await DataGouvService.findDataset(id[1]);

        setOrganization(dataset.organization);
      }
    };

    loadOrganization();
  }, [revision]);

  return (
    <Pane>
      {organization ? (
        <>
          <Paragraph marginTop={16}>
            Une Base Adresse Locale est déjà gérée par {organization.name} pour
            votre commune.
          </Paragraph>
          <Paragraph marginTop={16}>
            Nous recommandons de prendre contact avec cet organisme.
          </Paragraph>
          <Paragraph marginTop={16}>
            <Button
              is="a"
              height={30}
              href={`${organization.page}/#/information`}
              target="_blank"
            >
              Page data.gouv {organization.name}
            </Button>
          </Paragraph>
        </>
      ) : (
        <Paragraph marginTop={16}>
          Une Base Adresse Locale a déjà été déposé pour votre commune
        </Paragraph>
      )}

      <Paragraph marginTop={16}>
        Toutefois, la commune étant compétente en matière d’adressage, vous
        pouvez prendre la main directement via Mes Adresses.
      </Paragraph>
    </Pane>
  );
}

export default AlertPublishedBALMoissoneur;
