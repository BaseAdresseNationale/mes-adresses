import React, { useContext } from "react";
import { Numero, NumerosService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { Signalement } from "@/lib/openapi-signalement";
import { useSignalementMapDiffDeletion } from "../../hooks/useSignalementMapDiffDeletion";
import LayoutContext from "@/contexts/layout";

interface SignalementDeleteNumeroProps {
  author: Signalement["author"];
  existingLocation: Numero;
  handleAccept: () => Promise<void>;
  handleReject: (reason?: string) => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementDeleteNumero({
  author,
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementDeleteNumeroProps) {
  const { numero, suffixe, voie, parcelles, positions } = existingLocation;
  const { pushToast } = useContext(LayoutContext);
  useSignalementMapDiffDeletion(existingLocation);

  const onAccept = async () => {
    try {
      await NumerosService.softDeleteNumero(existingLocation.id);
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
      <SignalementNumeroDiffCard
        isActive
        signalementType={Signalement.type.LOCATION_TO_DELETE}
        title="Demande de suppression d'adresse"
        numero={{
          to: `${numero}${suffixe ? ` ${suffixe}` : ""}`,
        }}
        voie={{
          to: voie.nom,
        }}
        complement={{
          to: existingLocation.toponyme?.nom,
        }}
        positions={{
          to: positions,
        }}
        parcelles={{
          to: parcelles,
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

export default SignalementDeleteNumero;
