import React, { useContext, useEffect } from "react";
import MapContext from "@/contexts/map";
import { getPositionName } from "@/lib/positions-types-list";
import MarkersContext from "@/contexts/markers";
import { SignalementNumeroDiffCard } from "../../signalement-diff/signalement-numero-diff-card";
import ParcellesContext from "@/contexts/parcelles";
import { ExistingNumero, Signalement } from "@/lib/openapi-signalement";
import { signalementTypeMap } from "../../signalement-type-badge";

interface SignalementViewerDeleteNumeroProps {
  signalement: Signalement;
}

function SignalementViewerDeleteNumero({
  signalement,
}: SignalementViewerDeleteNumeroProps) {
  const { existingLocation, status } = signalement;
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { isStyleLoaded, setIsCadastreDisplayed } = useContext(MapContext);
  const { setHighlightedParcelles, setShowSelectedParcelles, setIsDiffMode } =
    useContext(ParcellesContext);

  const { numero, suffixe, toponyme, parcelles, position, nomComplement } =
    existingLocation as ExistingNumero;

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
    addMarker({
      id: "deleted-numero",
      isMapMarker: true,
      isDisabled: true,
      color: "grey",
      label: getPositionName(position.type),
      longitude: position.point.coordinates[0],
      latitude: position.point.coordinates[1],
    });

    return () => {
      disableMarkers();
    };
  }, [position, addMarker, disableMarkers]);

  return (
    <>
      <SignalementNumeroDiffCard
        isActive
        backgroundColor={
          signalementTypeMap[Signalement.type.LOCATION_TO_DELETE]
            .backgroundColor
        }
        title={`Demande de suppression d'adresse ${
          status === Signalement.status.PROCESSED ? "acceptée" : "refusée"
        }`}
        numero={{
          to: `${numero}${suffixe ? ` ${suffixe}` : ""}`,
        }}
        voie={{
          to: toponyme.nom,
        }}
        complement={{
          to: nomComplement,
        }}
        positions={{
          to: [position],
        }}
        parcelles={{
          to: parcelles,
        }}
      />
    </>
  );
}

export default SignalementViewerDeleteNumero;
