import React, { useMemo } from "react";
import {
  ExistingToponyme,
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import { useSignalementMapDiffUpdate } from "@/components/signalement/hooks/useSignalementMapDiffUpdate";
import { ActiveCardEnum } from "@/lib/utils/signalement";

interface SignalementViewerUpdateToponymeProps {
  signalement: Signalement;
}

function SignalementViewerUpdateToponyme({
  signalement,
}: SignalementViewerUpdateToponymeProps) {
  const { existingLocation, changesRequested, status } = signalement;

  const {
    nom: existingNom,
    position: existingPosition,
    parcelles: existingParcelles,
  } = existingLocation as ExistingToponyme;

  const { nom, positions, parcelles } =
    changesRequested as ToponymeChangesRequestedDTO;

  const existingPositions = useMemo(
    () => [existingPosition],
    [existingPosition]
  );

  const { activeCard, setActiveCard } = useSignalementMapDiffUpdate(
    { positions: existingPositions, parcelles: existingParcelles },
    { positions, parcelles }
  );

  return (
    <>
      <SignalementToponymeDiffCard
        title="Toponyme concerné"
        isActive={activeCard === ActiveCardEnum.INITIAL}
        nom={{
          to: existingNom,
        }}
        positions={{
          to: existingPositions,
        }}
        parcelles={{
          to: existingParcelles,
        }}
        onClick={() => {
          setActiveCard(ActiveCardEnum.INITIAL);
        }}
      />
      <SignalementToponymeDiffCard
        title={`Modification ${
          status === Signalement.status.PROCESSED ? "acceptée" : "refusée"
        }`}
        isActive={activeCard === ActiveCardEnum.CHANGES}
        signalementType={Signalement.type.LOCATION_TO_UPDATE}
        backgroundColor={
          status === Signalement.status.PROCESSED ? "#97D7BF" : "#EE9191"
        }
        nom={{
          from: existingNom,
          to: nom,
        }}
        positions={{
          from: existingPositions,
          to: positions,
        }}
        parcelles={{
          from: existingParcelles,
          to: parcelles,
        }}
        onClick={() => {
          setActiveCard(ActiveCardEnum.CHANGES);
        }}
      />
    </>
  );
}

export default SignalementViewerUpdateToponyme;
