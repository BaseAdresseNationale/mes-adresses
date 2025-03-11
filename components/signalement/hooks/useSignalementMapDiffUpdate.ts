import { parcelleDiff } from "@/components/signalement/signalement-diff/signalement-parcelle-diff";
import { positionDiff } from "@/components/signalement/signalement-diff/signalement-position-diff";
import MapContext from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import ParcellesContext from "@/contexts/parcelles";
import { getPositionName } from "@/lib/positions-types-list";
import { ActiveCardEnum, SignalementDiff } from "@/lib/utils/signalement";
import { useContext, useEffect, useState } from "react";
import { useMapStyleLoaded } from "./useMapStyleLoaded";

export type SignalementMapDiffUpdateExistingLocation = {
  positions: any[];
  parcelles: string[];
};

export type SignalementMapDiffUpdateChangesRequested = {
  positions: any[];
  parcelles: string[];
};

export function useSignalementMapDiffUpdate(
  existingLocation: SignalementMapDiffUpdateExistingLocation,
  changesRequested: SignalementMapDiffUpdateChangesRequested
) {
  const { positions, parcelles } = changesRequested;
  const { positions: existingPositions, parcelles: existingParcelles } =
    existingLocation;
  const [initialized, setInitialized] = useState(false);
  const [activeCard, setActiveCard] = useState<ActiveCardEnum>();
  const { addMarker, disableMarkers } = useContext(MarkersContext);
  const { isStyleLoaded, setIsCadastreDisplayed, map } = useContext(MapContext);
  const { isMapLoaded } = useMapStyleLoaded();
  const {
    setHighlightedParcelles,
    setShowSelectedParcelles,
    handleSetFeatureState,
    setIsDiffMode,
  } = useContext(ParcellesContext);

  const [positionsToDisplay, setPositionsToDisplay] = useState<any[]>([]);

  useEffect(() => {
    if (isStyleLoaded && parcelles?.length > 0) {
      setIsCadastreDisplayed(true);
      setShowSelectedParcelles(false);
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
    setHighlightedParcelles,
    setShowSelectedParcelles,
    setIsDiffMode,
    parcelles,
  ]);

  useEffect(() => {
    if (!isMapLoaded || initialized) {
      return;
    }

    setActiveCard(ActiveCardEnum.CHANGES);
    setInitialized(true);
  }, [isMapLoaded, initialized]);

  useEffect(() => {
    if (positionsToDisplay?.length > 0) {
      positionsToDisplay.forEach((position) => {
        addMarker({
          id: position.id,
          isMapMarker: true,
          isDisabled: true,
          color: position.color,
          label: getPositionName(position.type),
          longitude: position.point.coordinates[0],
          latitude: position.point.coordinates[1],
        });
      });
    }

    return () => {
      disableMarkers();
    };
  }, [positionsToDisplay, addMarker, disableMarkers]);

  useEffect(() => {
    switch (activeCard) {
      case ActiveCardEnum.INITIAL:
        setPositionsToDisplay(
          existingPositions.map((position) => ({
            ...position,
            color: "grey",
          }))
        );

        if (existingParcelles?.length > 0) {
          setHighlightedParcelles(existingParcelles);
          existingParcelles.forEach((parcelle) => {
            handleSetFeatureState(parcelle, {
              diff: SignalementDiff.UNCHANGED,
            });
          });
        } else {
          setHighlightedParcelles([]);
        }
        break;
      case ActiveCardEnum.CHANGES:
        setPositionsToDisplay(
          positionDiff(positions, existingPositions as any).map((position) => ({
            ...position,
            color:
              position.diff === SignalementDiff.DELETED
                ? "orange"
                : position.diff === SignalementDiff.NEW
                  ? "teal"
                  : Array.isArray(position.diff) &&
                      position.diff[0] !== position.diff[1]
                    ? "purple"
                    : "grey",
          }))
        );
        const _parcelleDiff = parcelleDiff(parcelles, existingParcelles);
        setHighlightedParcelles(_parcelleDiff.map(({ parcelle }) => parcelle));
        _parcelleDiff.forEach(({ parcelle, diff }) => {
          handleSetFeatureState(parcelle, { diff });
        });
        break;
      case ActiveCardEnum.FINAL:
        setPositionsToDisplay(
          positions.map((position) => ({
            ...position,
            color: "grey",
          }))
        );
        if (parcelles?.length > 0) {
          setHighlightedParcelles(parcelles);
          parcelles.forEach((parcelle) => {
            handleSetFeatureState(parcelle, {
              diff: SignalementDiff.UNCHANGED,
            });
          });
        } else {
          setHighlightedParcelles([]);
        }
        break;
    }
  }, [
    activeCard,
    parcelles,
    positions,
    existingParcelles,
    existingPositions,
    handleSetFeatureState,
    setHighlightedParcelles,
  ]);

  return {
    activeCard,
    setActiveCard,
  };
}
