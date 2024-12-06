import React, { useContext, useEffect } from "react";
import MapContext from "@/contexts/map";
import { Numero, NumerosService } from "@/lib/openapi-api-bal";
import { SignalementFormButtons } from "../signalement-form-buttons";
import { getPositionName } from "@/lib/positions-types-list";
import MarkersContext from "@/contexts/markers";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import ParcellesContext from "@/contexts/parcelles";
import { signalementTypeMap } from "../../signalement-type-badge";
import { Signalement } from "@/lib/openapi-signalement";

interface SignalementDeleteNumeroProps {
  existingLocation: Numero;
  handleAccept: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleClose: () => void;
  isLoading: boolean;
}

function SignalementDeleteNumero({
  existingLocation,
  handleAccept,
  handleReject,
  handleClose,
  isLoading,
}: SignalementDeleteNumeroProps) {
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { isStyleLoaded, setIsCadastreDisplayed } = useContext(MapContext);
  const { setHighlightedParcelles, setShowSelectedParcelles, setIsDiffMode } =
    useContext(ParcellesContext);

  const { numero, suffixe, voie, parcelles, positions } = existingLocation;

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
    if (positions.length > 0) {
      positions.forEach((position) => {
        addMarker({
          id: position.id,
          isMapMarker: true,
          isDisabled: true,
          color: "gray",
          label: getPositionName(position.type),
          longitude: position.point.coordinates[0],
          latitude: position.point.coordinates[1],
        });
      });
    }

    return () => {
      disableMarkers();
    };
  }, [positions, addMarker, disableMarkers]);

  const onAccept = async () => {
    await NumerosService.softDeleteNumero(existingLocation.id);
    await handleAccept();
  };

  return (
    <>
      <SignalementNumeroDiffCard
        isActive
        backgroundColor={
          signalementTypeMap[Signalement.type.LOCATION_TO_DELETE]
            .backgroundColor
        }
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
        onAccept={onAccept}
        onReject={handleReject}
        isLoading={isLoading}
        onClose={handleClose}
      />
    </>
  );
}

export default SignalementDeleteNumero;
