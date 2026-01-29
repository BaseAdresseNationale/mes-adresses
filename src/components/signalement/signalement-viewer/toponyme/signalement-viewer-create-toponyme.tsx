import React from "react";
import {
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { BanCircleIcon, TickCircleIcon } from "evergreen-ui";
import { useSignalementMapDiffCreation } from "../../hooks/useSignalementMapDiffCreation";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";

interface SignalementViewerCreateToponymeProps {
  signalement: Signalement;
}

function SignalementViewerCreateToponyme({
  signalement,
}: SignalementViewerCreateToponymeProps) {
  const { changesRequested, status } = signalement;

  const { nom, parcelles, positions } =
    changesRequested as ToponymeChangesRequestedDTO;
  useSignalementMapDiffCreation(
    changesRequested as ToponymeChangesRequestedDTO
  );

  return (
    <SignalementToponymeDiffCard
      title={
        <>
          Demande de création de toponyme{" "}
          {status === Signalement.status.PROCESSED ? "acceptée" : "refusée"}
          {status === Signalement.status.PROCESSED ? (
            <TickCircleIcon size={20} color="success" marginLeft={10} />
          ) : (
            <BanCircleIcon size={20} color="danger" marginLeft={10} />
          )}
        </>
      }
      isActive
      signalementType={Signalement.type.LOCATION_TO_CREATE}
      nom={{
        to: nom,
      }}
      positions={{
        to: positions,
      }}
      parcelles={{
        to: parcelles,
      }}
    />
  );
}

export default SignalementViewerCreateToponyme;
