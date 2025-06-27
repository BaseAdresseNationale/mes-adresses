import React, { useContext } from "react";
import {
  Signalement,
  VoieChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { Voie, VoiesService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementVoieDiffCard } from "../../signalement-diff/signalement-voie-diff-card";
import LayoutContext from "@/contexts/layout";

interface SignalementUpdateVoieProps {
  signalement: Signalement;
  author?: Signalement["author"];
  existingLocation: Voie;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementUpdateVoie({
  signalement,
  author,
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementUpdateVoieProps) {
  const { nom: existingNom } = existingLocation;
  const { nom } = signalement.changesRequested as VoieChangesRequestedDTO;
  const { pushToast } = useContext(LayoutContext);

  const onAccept = async () => {
    try {
      await VoiesService.updateVoie(existingLocation.id, {
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
      <SignalementVoieDiffCard
        title="Nom actuel de la voie"
        nom={{
          to: existingNom,
        }}
      />
      <SignalementVoieDiffCard
        title="Modification proposée"
        signalementType={Signalement.type.LOCATION_TO_UPDATE}
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
        author={author}
        onAccept={onAccept}
        onReject={handleReject}
        isLoading={isLoading}
        onClose={handleClose}
      />
    </>
  );
}

export default SignalementUpdateVoie;
