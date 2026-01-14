import React, { useContext } from "react";
import {
  Signalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { Toponyme, ToponymesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementToponymeDiffCard } from "../../signalement-diff/signalement-toponyme-diff-card";
import { ActiveCardEnum } from "@/lib/utils/signalement";
import { useSignalementMapDiffUpdate } from "@/components/signalement/hooks/useSignalementMapDiffUpdate";
import LayoutContext from "@/contexts/layout";

interface SignalementUpdateToponymeProps {
  signalement: Signalement;
  author?: Signalement["author"];
  existingLocation: Toponyme;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementUpdateToponyme({
  signalement,
  author,
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
  const { pushToast } = useContext(LayoutContext);

  const { activeCard, setActiveCard } = useSignalementMapDiffUpdate(
    { positions: existingPositions, parcelles: existingParcelles },
    { positions, parcelles }
  );

  const onAccept = async () => {
    try {
      await ToponymesService.updateToponyme(existingLocation.id, {
        nom,
      });
      await handleAccept();
    } catch (error) {
      console.error("Error accepting signalement:", error);
      pushToast({
        title: "Erreur lors de l'acceptation du signalement.",
        intent: "danger",
      });
    }
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
        author={author}
        onAccept={onAccept}
        onReject={handleReject}
        isLoading={isLoading}
        onClose={handleClose}
      />
    </>
  );
}

export default SignalementUpdateToponyme;
