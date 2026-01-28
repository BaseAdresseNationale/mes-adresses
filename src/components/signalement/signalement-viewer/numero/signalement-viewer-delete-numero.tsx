import React, { useMemo } from "react";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { ExistingNumero, Signalement } from "@/lib/openapi-signalement";
import { useSignalementMapDiffDeletion } from "../../hooks/useSignalementMapDiffDeletion";
import { BanCircleIcon, TickCircleIcon } from "evergreen-ui";

interface SignalementViewerDeleteNumeroProps {
  signalement: Signalement;
}

function SignalementViewerDeleteNumero({
  signalement,
}: SignalementViewerDeleteNumeroProps) {
  const { existingLocation, status } = signalement;

  const { numero, suffixe, toponyme, parcelles, position, nomComplement } =
    existingLocation as ExistingNumero;

  const mapDiffLocation = useMemo(
    () => ({ parcelles, positions: [position] }),
    [parcelles, position]
  );

  useSignalementMapDiffDeletion(mapDiffLocation);

  return (
    <>
      <SignalementNumeroDiffCard
        isActive
        signalementType={Signalement.type.LOCATION_TO_DELETE}
        title={
          <>
            Demande de suppression d&apos;adresse{" "}
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
          to: toponyme.nom,
        }}
        complement={{
          to: nomComplement,
        }}
        positions={{
          to: [position],
        }}
        parcelles={{
          to: parcelles,
        }}
      />
    </>
  );
}

export default SignalementViewerDeleteNumero;
