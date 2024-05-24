import React from "react";
import {
  Signalement,
  VoieChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { Voie, VoiesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementVoieDiffCard } from "../../signalement-diff/signalement-voie-diff-card";
import { signalementTypeMap } from "../../signalement-type-badge";

interface SignalementUpdateVoieProps {
  signalement: Signalement;
  existingLocation: Voie;
  handleAccept: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementUpdateVoie({
  signalement,
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementUpdateVoieProps) {
  const { nom: existingNom } = existingLocation;
  const { nom } = signalement.changesRequested as VoieChangesRequestedDTO;

  const onAccept = async () => {
    await VoiesService.updateVoie(existingLocation.id, {
      nom,
    });
    await handleAccept();
  };

  return (
    <>
      <SignalementVoieDiffCard
        title="Nom actuel de la voie"
        nom={{
          to: existingNom,
        }}
      />
      <SignalementVoieDiffCard
        title="Modification proposée"
        backgroundColor={
          signalementTypeMap[Signalement.type.LOCATION_TO_UPDATE]
            .backgroundColor
        }
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

export default SignalementUpdateVoie;
