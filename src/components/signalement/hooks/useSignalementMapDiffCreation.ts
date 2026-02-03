"use client";

import MarkersContext from "@/contexts/markers";
import ParcellesContext from "@/contexts/parcelles";
import { useContext, useEffect, useState } from "react";
import {
  NumeroChangesRequestedDTO,
  Position as PositionSignalement,
  ToponymeChangesRequestedDTO,
} from "@/lib/openapi-signalement";
import { getPositionName } from "@/lib/positions-types-list";
import { useMapStyleLoaded } from "./useMapStyleLoaded";
import { SignalementDiff } from "@/lib/utils/signalement";
import { useSignalementCadastre } from "./useSignalementCadastre";

export function useSignalementMapDiffCreation(
  changesRequested: NumeroChangesRequestedDTO | ToponymeChangesRequestedDTO
) {
  const { parcelles, positions } = changesRequested;
  const [initialized, setInitialized] = useState(false);
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { isMapLoaded } = useMapStyleLoaded();
  const { setHighlightedParcelles, handleSetFeatureState } =
    useContext(ParcellesContext);

  useSignalementCadastre(parcelles);

  useEffect(() => {
    if (!isMapLoaded || initialized) {
      return;
    }

    setHighlightedParcelles(parcelles);
    parcelles.forEach((parcelle) => {
      handleSetFeatureState(parcelle, {
        diff: SignalementDiff.NEW,
      });
    });
    setInitialized(true);
  }, [
    initialized,
    setHighlightedParcelles,
    parcelles,
    isMapLoaded,
    handleSetFeatureState,
  ]);

  useEffect(() => {
    if (positions?.length > 0) {
      positions.forEach(
        (position: PositionSignalement & { id: string }, index) => {
          addMarker({
            id: position.id || index.toString(),
            isMapMarker: true,
            isDisabled: true,
            color: "teal",
            longitude: position.point.coordinates[0],
            latitude: position.point.coordinates[1],
            label: getPositionName(position.type),
          });
        }
      );
    }

    return () => {
      disableMarkers();
    };
  }, [positions, addMarker, disableMarkers]);
}
