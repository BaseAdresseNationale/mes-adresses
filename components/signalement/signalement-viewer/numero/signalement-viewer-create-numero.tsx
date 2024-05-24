import React, { useContext, useEffect } from "react";
import {
  NumeroChangesRequestedDTO,
  Signalement,
  Position as PositionSignalement,
} from "@/lib/openapi-signalement";
import MarkersContext from "@/contexts/markers";
import { getPositionName } from "@/lib/positions-types-list";
import MapContext from "@/contexts/map";
import ParcellesContext from "@/contexts/parcelles";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import { signalementTypeMap } from "../../signalement-type-badge";

interface SignalementViewerCreateNumeroProps {
  signalement: Signalement;
}

function SignalementViewerCreateNumero({
  signalement,
}: SignalementViewerCreateNumeroProps) {
  const { changesRequested, status } = signalement;
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { isStyleLoaded, setIsCadastreDisplayed } = useContext(MapContext);
  const { setHighlightedParcelles, setShowSelectedParcelles, setIsDiffMode } =
    useContext(ParcellesContext);

  const { numero, suffixe, parcelles, positions, nomVoie, nomComplement } =
    changesRequested as NumeroChangesRequestedDTO;

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
          color: "grey",
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

  return (
    <>
      <SignalementNumeroDiffCard
        isActive
        backgroundColor={
          signalementTypeMap[Signalement.type.LOCATION_TO_CREATE]
            .backgroundColor
        }
        title={`Demande de création d'adresse ${
          status === Signalement.status.PROCESSED ? "acceptée" : "refusée"
        }`}
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
      />
    </>
  );
}

export default SignalementViewerCreateNumero;
