import { Alert, Paragraph, Strong } from "evergreen-ui";

import { PublicClient, Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";

interface AlertPublishedBALApiDepotProps {
  revision: Revision;
  outdatedApiDepotClients: string[];
  commune: CommuneType;
}

function AlertPublishedBALApiDepot({
  revision,
  outdatedApiDepotClients,
  commune,
}: AlertPublishedBALApiDepotProps) {
  const client: PublicClient = revision.client;
  const isOutdatedClient = outdatedApiDepotClients.includes(client.id);

  return (
    <Alert
      title={`Une Base Adresse Locale a déjà été publiée pour ${commune.nom}`}
      intent={isOutdatedClient ? "info" : "warning"}
      marginTop={16}
    >
      <Paragraph marginTop={16}>
        Une Base Adresse Locale a déjà été publiée par{" "}
        <Strong>
          {client.chefDeFile ? client.chefDeFile : client.mandataire}
        </Strong>{" "}
        pour {commune.nom}.
        {isOutdatedClient ? (
          <>
            La Base Adresse Locale publiée est obsolète et n&apos;est plus
            maintenue. Vous pouvez donc poursuivre la création de votre BAL.
          </>
        ) : client.chefDeFileEmail ? (
          <>
            Nous vous recommandons de prendre contact avec{" "}
            <Strong>{client.chefDeFileEmail}</Strong> avant de poursuivre la
            création de votre BAL.
          </>
        ) : null}
      </Paragraph>
      <Paragraph marginTop={16}>
        La commune reste toutefois l’autorité compétente en matière d’adressage,
        et vous pouvez décider à tout moment de reprendre la main sur la
        publication de votre BAL.
      </Paragraph>
    </Alert>
  );
}

export default AlertPublishedBALApiDepot;
