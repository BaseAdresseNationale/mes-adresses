import React from "react";
import { ExistingVoie, Signalement } from "@/lib/openapi-signalement";
import { SignalementVoieDiffCard } from "../../signalement-diff/signalement-voie-diff-card";
import { BanCircleIcon, TickCircleIcon } from "evergreen-ui";

interface SignalementViewerDeleteVoieProps {
  signalement: Signalement;
}

function SignalementViewerDeleteVoie({
  signalement,
}: SignalementViewerDeleteVoieProps) {
  const { existingLocation, status } = signalement;
  const { nom: existingNom } = existingLocation as ExistingVoie;

  return (
    <SignalementVoieDiffCard
      signalementType={Signalement.type.LOCATION_TO_DELETE}
      title={
        <>
          Demande de suppression de voie{" "}
          {status === Signalement.status.PROCESSED ? "acceptée" : "refusée"}
          {status === Signalement.status.PROCESSED ? (
            <TickCircleIcon size={20} color="success" marginLeft={10} />
          ) : (
            <BanCircleIcon size={20} color="danger" marginLeft={10} />
          )}
        </>
      }
      nom={{
        to: existingNom,
      }}
    />
  );
}

export default SignalementViewerDeleteVoie;
