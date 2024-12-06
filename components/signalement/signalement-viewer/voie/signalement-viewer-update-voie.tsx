import React from "react";
import {
  ExistingVoie,
  Signalement,
  VoieChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { SignalementVoieDiffCard } from "../../signalement-diff/signalement-voie-diff-card";
import { signalementTypeMap } from "../../signalement-type-badge";

interface SignalementViewerUpdateVoieProps {
  signalement: Signalement;
}

function SignalementViewerUpdateVoie({
  signalement,
}: SignalementViewerUpdateVoieProps) {
  const { existingLocation, changesRequested, status } = signalement;
  const { nom: existingNom } = existingLocation as ExistingVoie;
  const { nom } = changesRequested as VoieChangesRequestedDTO;

  return (
    <>
      <SignalementVoieDiffCard
        title="Nom de la voie avant modification"
        nom={{
          to: existingNom,
        }}
      />
      <SignalementVoieDiffCard
        title={`Modification ${
          status === Signalement.status.PROCESSED ? "acceptée" : "refusée"
        }`}
        nom={{
          from: existingNom,
          to: nom,
        }}
      />
      <SignalementVoieDiffCard
        title="Nom de la voie après modification"
        nom={{
          to: nom,
        }}
        backgroundColor={
          signalementTypeMap[Signalement.type.LOCATION_TO_UPDATE]
            .backgroundColor
        }
      />
    </>
  );
}

export default SignalementViewerUpdateVoie;
