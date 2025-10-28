import { useState, useEffect } from "react";
import { Alert, Spinner } from "evergreen-ui";
import { DataGouvService } from "@/lib/data-gouv/data-gouv";
import { Dataset, Organization } from "@/lib/data-gouv/types";
import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import PublishedBALMoissoneur from "./published-bal-moissoneur";

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
  const isOutdatedSource = outdatedHarvestSources.includes(
    revision.context.extras.sourceId
  );

  return (
    <Alert
      title={`Une Base Adresse Locale a déjà été publiée pour ${commune.nom}`}
      intent={isOutdatedSource ? "info" : "warning"}
      marginTop={16}
    >
      <PublishedBALMoissoneur
        revision={revision}
        outdatedHarvestSources={outdatedHarvestSources}
        commune={commune}
      />
    </Alert>
  );
}

export default AlertPublishedBALMoissoneur;
