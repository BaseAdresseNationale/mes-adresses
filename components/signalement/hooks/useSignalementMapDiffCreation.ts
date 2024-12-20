import MapContext from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import ParcellesContext from "@/contexts/parcelles";
import { useContext, useEffect } from "react";
import {
  NumeroChangesRequestedDTO,
  Position as PositionSignalement,
} from "@/lib/openapi-signalement";
import { getPositionName } from "@/lib/positions-types-list";
import { useMapStyleLoaded } from "./useMapStyleLoaded";

export function useSignalementMapDiffCreation(
  changesRequested: NumeroChangesRequestedDTO
) {
  const { parcelles, positions } = changesRequested;

  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { isStyleLoaded, setIsCadastreDisplayed, map } = useContext(MapContext);
  const { isMapLoaded } = useMapStyleLoaded();
  const { setHighlightedParcelles, setShowSelectedParcelles, setIsDiffMode } =
    useContext(ParcellesContext);

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
    if (!isMapLoaded || !map) {
      return;
    }

    setHighlightedParcelles(parcelles);
  }, [map, setHighlightedParcelles, parcelles, isMapLoaded]);

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
}
