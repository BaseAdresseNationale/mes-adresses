import React from "react";
import {
  NumeroChangesRequestedDTO,
  Signalement,
} from "@/lib/openapi-signalement";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { signalementTypeMap } from "../../signalement-type-badge";
import { useSignalementMapDiffCreation } from "@/components/signalement/hooks/useSignalementMapDiffCreation";

interface SignalementViewerCreateNumeroProps {
  signalement: Signalement;
}

function SignalementViewerCreateNumero({
  signalement,
}: SignalementViewerCreateNumeroProps) {
  const { changesRequested, status } = signalement;

  const { numero, suffixe, parcelles, positions, nomVoie, nomComplement } =
    changesRequested as NumeroChangesRequestedDTO;

  useSignalementMapDiffCreation(changesRequested as NumeroChangesRequestedDTO);

  return (
    <>
      <SignalementNumeroDiffCard
        isActive
        signalementType={Signalement.type.LOCATION_TO_CREATE}
        title={`Demande de création d'adresse ${
          status === Signalement.status.PROCESSED ? "acceptée" : "refusée"
        }`}
        numero={{
          to: `${numero}${suffixe ? ` ${suffixe}` : ""}`,
        }}
        voie={{
          to: nomVoie,
        }}
        complement={{
          to: nomComplement,
        }}
        positions={{
          to: positions,
        }}
        parcelles={{
          to: parcelles,
        }}
      />
    </>
  );
}

export default SignalementViewerCreateNumero;
