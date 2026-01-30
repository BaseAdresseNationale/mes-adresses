import { Alert } from "evergreen-ui";

import { PublicClient, Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import PublishedBALApiDepot from "./published-bal-api-depot";

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
      <PublishedBALApiDepot
        revision={revision}
        outdatedApiDepotClients={outdatedApiDepotClients}
        commune={commune}
      />
    </Alert>
  );
}

export default AlertPublishedBALApiDepot;
