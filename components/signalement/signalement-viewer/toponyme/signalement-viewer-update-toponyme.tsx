import React, { useMemo } from "react";
import {
  ExistingToponyme,
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import { signalementTypeMap } from "../../signalement-type-badge";
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
        title="Modification demandée"
        isActive={activeCard === ActiveCardEnum.CHANGES}
        signalementType={Signalement.type.LOCATION_TO_UPDATE}
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
      <SignalementToponymeDiffCard
        title={`Modification ${
          status === Signalement.status.PROCESSED ? "acceptée" : "refusée"
        }`}
        isActive={activeCard === ActiveCardEnum.FINAL}
        nom={{
          to: nom,
        }}
        positions={{
          to: positions,
        }}
        parcelles={{
          to: parcelles,
        }}
        onClick={() => {
          setActiveCard(ActiveCardEnum.FINAL);
        }}
      />
    </>
  );
}

export default SignalementViewerUpdateToponyme;
