import React, { useContext, useEffect } from "react";
import { Toponyme, Voie, VoiesService } from "@/lib/openapi-api-bal";
import {
  NumeroChangesRequestedDTO,
  Signalement,
  Position as PositionSignalement,
} from "@/lib/openapi-signalement";
import { SignalementFormButtons } from "../signalement-form-buttons";
import MarkersContext from "@/contexts/markers";
import { getPositionName } from "@/lib/positions-types-list";
import MapContext from "@/contexts/map";
import ParcellesContext from "@/contexts/parcelles";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { signalementTypeMap } from "../../signalement-type-badge";

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
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { isStyleLoaded, setIsCadastreDisplayed } = useContext(MapContext);
  const { setHighlightedParcelles, setShowSelectedParcelles, setIsDiffMode } =
    useContext(ParcellesContext);

  const { numero, suffixe, parcelles, positions, nomVoie } =
    signalement.changesRequested as NumeroChangesRequestedDTO;

  useEffect(() => {
    if (isStyleLoaded && parcelles?.length > 0) {
      setIsCadastreDisplayed(true);
      setShowSelectedParcelles(false);
      setHighlightedParcelles(parcelles);
      setIsDiffMode(true);

      return () => {
        setIsCadastreDisplayed(false);
        setShowSelectedParcelles(true);
        setHighlightedParcelles([]);
        setIsDiffMode(false);
      };
    }
  }, [
    isStyleLoaded,
    setIsCadastreDisplayed,
    parcelles,
    setHighlightedParcelles,
    setShowSelectedParcelles,
    setIsDiffMode,
  ]);

  useEffect(() => {
    if (positions?.length > 0) {
      positions.forEach((position: PositionSignalement & { id: string }) => {
        addMarker({
          id: position.id,
          isMapMarker: true,
          isDisabled: true,
          color: "gray",
          longitude: position.point.coordinates[0],
          latitude: position.point.coordinates[1],
          label: getPositionName(position.type),
        });
      });
    }

    return () => {
      disableMarkers();
    };
  }, [positions, addMarker, disableMarkers]);

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
        backgroundColor={
          signalementTypeMap[Signalement.type.LOCATION_TO_CREATE]
            .backgroundColor
        }
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
