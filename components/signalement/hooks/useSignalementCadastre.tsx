import MapContext from "@/contexts/map";
import ParcellesContext from "@/contexts/parcelles";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect } from "react";

export function useSignalementCadastre(parcelles: string[]) {
  const { isStyleLoaded, setIsCadastreDisplayed } = useContext(MapContext);

  const { setHighlightedParcelles, setShowSelectedParcelles, setIsDiffMode } =
    useContext(ParcellesContext);
  const router = useRouter();

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
    const cb = () => toggleSignalementCadastre(false);
    router.events.on("routeChangeStart", cb);

    return () => {
      router.events.off("routeChangeStart", cb);
    };
  }, [router.events, toggleSignalementCadastre]);

  // Enable cadastre when there are parcelles and the map style is loaded
  useEffect(() => {
    if (isStyleLoaded && parcelles?.length > 0) {
      toggleSignalementCadastre(true);
    }
  }, [toggleSignalementCadastre, isStyleLoaded, parcelles]);
}
