import React from "react";
import { Toponyme, Voie, VoiesService } from "@/lib/openapi-api-bal";
import {
  NumeroChangesRequestedDTO,
  Signalement,
} from "@/lib/openapi-signalement";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { useSignalementMapDiffCreation } from "@/components/signalement/hooks/useSignalementMapDiffCreation";

interface SignalementCreateNumeroProps {
  signalement: Signalement;
  voie: Voie;
  requestedToponyme?: Toponyme;
  handleAccept: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementCreateNumero({
  signalement,
  voie,
  requestedToponyme,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementCreateNumeroProps) {
  const { numero, suffixe, parcelles, positions, nomVoie } =
    signalement.changesRequested as NumeroChangesRequestedDTO;

  useSignalementMapDiffCreation(
    signalement.changesRequested as NumeroChangesRequestedDTO
  );

  const onAccept = async () => {
    await VoiesService.createNumero(voie.id, {
      numero,
      suffixe,
      positions: positions as any[],
      parcelles,
      certifie: true,
      toponymeId: requestedToponyme?.id,
    });
    await handleAccept();
  };

  return (
    <>
      <SignalementNumeroDiffCard
        isActive
        signalementType={Signalement.type.LOCATION_TO_CREATE}
        title="Demande de création d'adresse"
        numero={{
          to: `${numero}${suffixe ? ` ${suffixe}` : ""}`,
        }}
        voie={{
          to: nomVoie,
        }}
        complement={{
          to: requestedToponyme?.nom,
        }}
        positions={{
          to: positions,
        }}
        parcelles={{
          to: parcelles,
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

export default SignalementCreateNumero;
