import React, { useState } from "react";
import {
  Numero,
  NumerosService,
  Toponyme,
  VoiesService,
} from "@/lib/openapi-api-bal";
import {
  Signalement,
  NumeroChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { ActiveCardEnum, detectChanges } from "@/lib/utils/signalement";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { signalementTypeMap } from "../../signalement-type-badge";
import { useSignalementMapDiffUpdate } from "@/components/signalement/hooks/useSignalementMapDiffUpdate";
import { Alert } from "evergreen-ui";

interface SignalementUpdateNumeroProps {
  signalement: Signalement;
  existingLocation: Numero;
  requestedToponyme?: Toponyme;
  handleAccept: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementUpdateNumero({
  signalement,
  existingLocation,
  requestedToponyme,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementUpdateNumeroProps) {
  const [changes] = useState(detectChanges(signalement, existingLocation));

  const { numero, suffixe, positions, parcelles, nomVoie } =
    signalement.changesRequested as NumeroChangesRequestedDTO;

  const {
    numero: existingNumero,
    suffixe: existingSuffixe,
    positions: existingPositions,
    parcelles: existingParcelles,
    voie: existingVoie,
  } = existingLocation;

  const { activeCard, setActiveCard } = useSignalementMapDiffUpdate(
    { positions: existingPositions, parcelles: existingParcelles },
    { positions, parcelles }
  );

  const onAccept = async () => {
    if (changes.voie) {
      await VoiesService.updateVoie(existingLocation.voie.id, {
        nom: nomVoie,
      });
    }
    await NumerosService.updateNumero(existingLocation.id, {
      numero,
      suffixe,
      positions: positions as any[],
      parcelles,
      toponymeId: requestedToponyme?.id,
    });
    await handleAccept();
  };

  return (
    <>
      <SignalementNumeroDiffCard
        title="Adresse actuelle"
        isActive={activeCard === ActiveCardEnum.INITIAL}
        numero={{
          to: `${existingNumero}${
            existingSuffixe ? ` ${existingSuffixe}` : ""
          }`,
        }}
        complement={{
          to: existingLocation.toponyme?.nom,
        }}
        voie={{
          to: existingVoie.nom,
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
      <SignalementNumeroDiffCard
        title="Modification proposée"
        isActive={activeCard === ActiveCardEnum.CHANGES}
        backgroundColor={
          signalementTypeMap[Signalement.type.LOCATION_TO_UPDATE]
            .backgroundColor
        }
        numero={{
          from: `${existingNumero}${
            existingSuffixe ? ` ${existingSuffixe}` : ""
          }`,
          to: `${numero}${suffixe ? ` ${suffixe}` : ""}`,
        }}
        voie={{
          from: existingVoie.nom,
          to: nomVoie,
        }}
        complement={{
          from: existingLocation.toponyme?.nom,
          to: requestedToponyme?.nom,
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
      <SignalementNumeroDiffCard
        title="Adresse après modification"
        isActive={activeCard === ActiveCardEnum.FINAL}
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
        onClick={() => {
          setActiveCard(ActiveCardEnum.FINAL);
        }}
      />
      {changes.voie && (
        <Alert intent="warning" title="Attention">
          Le renommage de la voie affectera toutes les adresses de cette voie.
        </Alert>
      )}
      <SignalementFormButtons
        onAccept={onAccept}
        onReject={handleReject}
        isLoading={isLoading}
        onClose={handleClose}
      />
    </>
  );
}

export default SignalementUpdateNumero;
