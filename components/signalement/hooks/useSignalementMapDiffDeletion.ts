import MapContext from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import ParcellesContext from "@/contexts/parcelles";
import { useContext, useEffect, useState } from "react";
import { getPositionName } from "@/lib/positions-types-list";
import { useMapStyleLoaded } from "./useMapStyleLoaded";

export function useSignalementMapDiffDeletion(existingLocation: {
  positions: any[];
  parcelles: string[];
}) {
  const { parcelles, positions } = existingLocation;
  const [initialized, setInitialized] = useState(false);
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
    if (!isMapLoaded || initialized) {
      return;
    }

    setHighlightedParcelles(parcelles);
    setInitialized(true);
  }, [initialized, setHighlightedParcelles, parcelles, isMapLoaded]);

  useEffect(() => {
    if (positions.length > 0) {
      positions.forEach((position) => {
        addMarker({
          id: position.id,
          isMapMarker: true,
          isDisabled: true,
          color: "grey",
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
}
