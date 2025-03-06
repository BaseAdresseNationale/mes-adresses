import React from "react";
import {
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { Toponyme, ToponymesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import { ActiveCardEnum } from "@/lib/utils/signalement";
import { useSignalementMapDiffUpdate } from "@/components/signalement/hooks/useSignalementMapDiffUpdate";

interface SignalementUpdateToponymeProps {
  signalement: Signalement;
  existingLocation: Toponyme;
  handleAccept: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementUpdateToponyme({
  signalement,
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementUpdateToponymeProps) {
  const {
    nom: existingNom,
    positions: existingPositions,
    parcelles: existingParcelles,
  } = existingLocation;

  const { nom, parcelles, positions } =
    signalement.changesRequested as ToponymeChangesRequestedDTO;

  const { activeCard, setActiveCard } = useSignalementMapDiffUpdate(
    { positions: existingPositions, parcelles: existingParcelles },
    { positions, parcelles }
  );

  const onAccept = async () => {
    await ToponymesService.updateToponyme(existingLocation.id, {
      nom,
    });
    await handleAccept();
  };

  return (
    <>
      <SignalementToponymeDiffCard
        title="Toponyme actuel"
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
        title="Modification proposée"
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
        title="Toponyme après modification"
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
      <SignalementFormButtons
        onAccept={onAccept}
        onReject={handleReject}
        isLoading={isLoading}
        onClose={handleClose}
      />
    </>
  );
}

export default SignalementUpdateToponyme;
