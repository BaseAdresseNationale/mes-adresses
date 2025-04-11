import { Pane, Paragraph, Strong } from "evergreen-ui";

import { PublicClient, Revision } from "@/lib/api-depot/types";

interface AlertAlertPublishedBALApiDepotProps {
  revision: Revision;
  outdatedApiDepotClients: string[];
}

function AlertPublishedBALApiDepot({
  revision,
  outdatedApiDepotClients,
}: AlertAlertPublishedBALApiDepotProps) {
  const client: PublicClient = revision.client;
  const isOutdatedClient = outdatedApiDepotClients.includes(client.id);

  return (
    <Pane>
      <Paragraph marginTop={16}>
        Une Base Adresse Locale est déjà gérée par{" "}
        <Strong>
          {client.chefDeFile ? client.chefDeFile : client.mandataire}
        </Strong>
        .
        {client.chefDeFileEmail && (
          <>
            Nous vous recommandons de prendre contact avec{" "}
            <Strong>{client.chefDeFileEmail}</Strong> avant de poursuivre la
            création de votre BAL.
          </>
        )}
      </Paragraph>
      <Paragraph marginTop={16}>
        La commune reste toutefois l’autorité compétente en matière d’adressage,
        et vous pouvez décider à tout moment de reprendre la main sur la
        publication de votre BAL.
      </Paragraph>
    </Pane>
  );
}

export default AlertPublishedBALApiDepot;
