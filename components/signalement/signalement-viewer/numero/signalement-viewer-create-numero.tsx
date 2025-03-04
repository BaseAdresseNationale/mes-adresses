import React from "react";
import {
  NumeroChangesRequestedDTO,
  Signalement,
} from "@/lib/openapi-signalement";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { useSignalementMapDiffCreation } from "@/components/signalement/hooks/useSignalementMapDiffCreation";
import { BanCircleIcon, TickCircleIcon } from "evergreen-ui";

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
        title={
          <>
            Demande de création d&apos;adresse{" "}
            {status === Signalement.status.PROCESSED ? "acceptée" : "refusée"}
            {status === Signalement.status.PROCESSED ? (
              <TickCircleIcon size={20} color="success" marginLeft={10} />
            ) : (
              <BanCircleIcon size={20} color="danger" marginLeft={10} />
            )}
          </>
        }
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
