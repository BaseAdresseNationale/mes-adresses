import React, { useMemo } from "react";
import {
  Signalement,
  NumeroChangesRequestedDTO,
  ExistingNumero,
} from "@/lib/openapi-signalement";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { signalementTypeMap } from "../../signalement-type-badge";
import { ActiveCardEnum } from "@/lib/utils/signalement";
import { useSignalementMapDiffUpdate } from "@/components/signalement/hooks/useSignalementMapDiffUpdate";

interface SignalementViewerUpdateNumeroProps {
  signalement: Signalement;
}

function SignalementViewerUpdateNumero({
  signalement,
}: SignalementViewerUpdateNumeroProps) {
  const { changesRequested, existingLocation, status } = signalement;

  const { numero, suffixe, positions, parcelles, nomVoie, nomComplement } =
    changesRequested as NumeroChangesRequestedDTO;

  const {
    numero: existingNumero,
    suffixe: existingSuffixe,
    position: existingPosition,
    parcelles: existingParcelles,
    toponyme: existingVoie,
    nomComplement: existingNomComplement,
  } = existingLocation as ExistingNumero;

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
      <SignalementNumeroDiffCard
        title="Adresse concernée"
        isActive={activeCard === ActiveCardEnum.INITIAL}
        numero={{
          to: `${existingNumero}${
            existingSuffixe ? ` ${existingSuffixe}` : ""
          }`,
        }}
        voie={{
          to: existingVoie.nom,
        }}
        complement={{
          to: existingNomComplement,
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
        title="Modification demandée"
        isActive={activeCard === ActiveCardEnum.CHANGES}
        signalementType={Signalement.type.LOCATION_TO_UPDATE}
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
          from: existingNomComplement,
          to: nomComplement,
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
        title={`Modification ${
          status === Signalement.status.PROCESSED ? "acceptée" : "refusée"
        }`}
        isActive={activeCard === ActiveCardEnum.FINAL}
        numero={{
          to: `${numero}${suffixe ? ` ${suffixe}` : ""}`,
        }}
        voie={{
          to: nomVoie,
        }}
        complement={{
          to: nomComplement,
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

export default SignalementViewerUpdateNumero;
