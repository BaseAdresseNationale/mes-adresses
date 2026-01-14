"use client";

import MapContext from "@/contexts/map";
import ParcellesContext from "@/contexts/parcelles";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect } from "react";

export function useSignalementCadastre(parcelles: string[]) {
  const { isStyleLoaded, setIsCadastreDisplayed } = useContext(MapContext);

  const { setHighlightedParcelles, setShowSelectedParcelles, setIsDiffMode } =
    useContext(ParcellesContext);
  const params = useParams();
  const toggleSignalementCadastre = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        setIsCadastreDisplayed(true);
        setShowSelectedParcelles(false);
        setHighlightedParcelles(parcelles);
        setIsDiffMode(true);
      } else {
        setIsCadastreDisplayed(false);
        setShowSelectedParcelles(true);
        setHighlightedParcelles([]);
        setIsDiffMode(false);
      }
    },
    [
      parcelles,
      setHighlightedParcelles,
      setIsCadastreDisplayed,
      setShowSelectedParcelles,
      setIsDiffMode,
    ]
  );

  // Disable cadastre on route change
  useEffect(() => {
    toggleSignalementCadastre(false);
  }, [params]);

  // Enable cadastre when there are parcelles and the map style is loaded
  useEffect(() => {
    if (isStyleLoaded && parcelles?.length > 0) {
      toggleSignalementCadastre(true);
    }
  }, [toggleSignalementCadastre, isStyleLoaded, parcelles]);
}
