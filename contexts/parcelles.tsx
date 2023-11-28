import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import type { Map as MaplibreMap, ExpressionSpecification } from "maplibre-gl";

import {
  SOURCE as CADASTRE_SOURCE,
  SOURCE_LAYER as CADASTRE_SOURCE_LAYER,
  LAYER as CADASTRE_LAYER,
} from "@/components/map/layers/cadastre";

import { ChildrenProps } from "@/types/context";
import MapContext from "@/contexts/map";
import BalDataContext from "./bal-data";

interface ParcellesContextType {
  selectedParcelles: string[];
  setSelectedParcelles: (value: string[]) => void;
  isParcelleSelectionEnabled: boolean;
  setIsParcelleSelectionEnabled: (value: boolean) => void;
  hoveredParcelle: { id: string; featureId?: string } | null;
  handleHoveredParcelle: (
    value: { id: string; featureId?: string } | null
  ) => void;
  handleParcelle: (value: string) => void;
}

const ParcellesContext = React.createContext<ParcellesContextType | null>(null);

function getHoveredFeatureId(map: MaplibreMap, id: string): string | undefined {
  const [feature] = map.querySourceFeatures(CADASTRE_SOURCE, {
    sourceLayer: CADASTRE_SOURCE_LAYER.PARCELLES,
    filter: ["==", ["get", "id"], id],
  });
  return (feature?.id as string) || undefined;
}

export function ParcellesContextProvider(props: ChildrenProps) {
  const { map, isCadastreDisplayed, isStyleLoaded } = useContext(MapContext);
  const { baseLocale, parcelles } = useContext(BalDataContext);

  const [hoveredParcelle, setHoveredParcelle] = useState<{
    id: string;
    featureId?: string;
  } | null>(null);
  const [isParcelleSelectionEnabled, setIsParcelleSelectionEnabled] =
    useState<boolean>(false);
  const [selectedParcelles, setSelectedParcelles] = useState<string[]>([]);

  const prevHoveredParcelle = useRef<string | undefined>();

  const handleHoveredParcelle = useCallback(
    (hovered: { id: string; featureId?: string } | null) => {
      if (map && hovered) {
        const featureId: string | undefined =
          hovered.featureId || getHoveredFeatureId(map, hovered.id);

        if (!hovered.featureId && isCadastreDisplayed) {
          // Handle parcelle from side menu
          map.setFeatureState(
            {
              source: CADASTRE_SOURCE,
              sourceLayer: CADASTRE_SOURCE_LAYER.PARCELLES,
              id: featureId,
            },
            { hover: true }
          );
          prevHoveredParcelle.current = featureId;
        }

        setHoveredParcelle({ id: hovered.id, featureId });
      } else {
        if (prevHoveredParcelle?.current && isCadastreDisplayed) {
          map.setFeatureState(
            {
              source: CADASTRE_SOURCE,
              sourceLayer: CADASTRE_SOURCE_LAYER.PARCELLES,
              id: prevHoveredParcelle.current,
            },
            { hover: false }
          );
          prevHoveredParcelle.current = null;
        }

        setHoveredParcelle(null);
      }
    },
    [map, isCadastreDisplayed]
  );

  const handleParcelle = useCallback(
    (parcelle: string) => {
      if (isParcelleSelectionEnabled) {
        setSelectedParcelles((parcelles: string[]) => {
          if (selectedParcelles.includes(parcelle)) {
            return selectedParcelles.filter((id) => id !== parcelle);
          }

          return [...parcelles, parcelle];
        });
        handleHoveredParcelle(null);
      }
    },
    [selectedParcelles, isParcelleSelectionEnabled, handleHoveredParcelle]
  );

  const toggleCadastreVisibility = useCallback(() => {
    Object.values(CADASTRE_LAYER).forEach((layerId: string) => {
      map.setLayoutProperty(
        layerId,
        "visibility",
        isCadastreDisplayed ? "visible" : "none"
      );
    });
  }, [map, isCadastreDisplayed]);

  const filterSelectedParcelles = useCallback(() => {
    if (parcelles.length > 0) {
      const exps: ExpressionSpecification[] = parcelles.map((id: string) => [
        "==",
        ["get", "id"],
        id,
      ]);
      map.setFilter(CADASTRE_LAYER.PARCELLES_SELECTED, ["any", ...exps]);
    } else {
      map.setFilter(CADASTRE_LAYER.PARCELLES_SELECTED, [
        "==",
        ["get", "id"],
        "",
      ]);
    }
  }, [map, parcelles]);

  const filterHighlightedParcelles = useCallback(() => {
    if (parcelles.length > 0) {
      const exps: ExpressionSpecification[] = selectedParcelles.map((id) => [
        "==",
        ["get", "id"],
        id,
      ]);
      map.setFilter(CADASTRE_LAYER.PARCELLE_HIGHLIGHTED, ["any", ...exps]);
    } else {
      map.setFilter(CADASTRE_LAYER.PARCELLE_HIGHLIGHTED, [
        "==",
        ["get", "id"],
        "",
      ]);
    }
  }, [map, isParcelleSelectionEnabled, selectedParcelles]);

  const reloadParcellesLayers = useCallback(() => {
    // Toggle all cadastre layers visiblity
    // Filter cadastre with code commune
    map.setFilter(CADASTRE_LAYER.PARCELLES, [
      "match",
      ["get", "commune"],
      baseLocale.commune,
      true,
      false,
    ]);
    map.setFilter(CADASTRE_LAYER.PARCELLES_FILL, [
      "match",
      ["get", "commune"],
      baseLocale.commune,
      true,
      false,
    ]);

    toggleCadastreVisibility();

    // Toggle selected parcelle visibility
    if (isCadastreDisplayed) {
      filterSelectedParcelles();
      filterHighlightedParcelles();
    }
  }, [
    map,
    baseLocale.commune,
    toggleCadastreVisibility,
    filterSelectedParcelles,
    filterHighlightedParcelles,
    isCadastreDisplayed,
  ]);

  // Toggle all cadastre layers visiblity
  useEffect(() => {
    if (
      map &&
      map.getSource(CADASTRE_SOURCE) &&
      isStyleLoaded &&
      isCadastreDisplayed
    ) {
      toggleCadastreVisibility();
    }
  }, [map, isStyleLoaded, toggleCadastreVisibility, isCadastreDisplayed]);

  // Updates highlighted parcelles when parcelles changes
  // or when selection is enabled/disabled
  useEffect(() => {
    if (map && isCadastreDisplayed && isStyleLoaded) {
      filterSelectedParcelles();
      filterHighlightedParcelles();
    }
  }, [
    map,
    isCadastreDisplayed,
    isStyleLoaded,
    filterHighlightedParcelles,
    filterSelectedParcelles,
  ]);

  // Reset isStyleLoaded when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled && isStyleLoaded) {
      setSelectedParcelles([]);
    }
  }, [isParcelleSelectionEnabled, isStyleLoaded]);

  useEffect(() => {
    if (isStyleLoaded) {
      reloadParcellesLayers();
    }
  }, [isStyleLoaded, reloadParcellesLayers]);

  const value = useMemo(
    () => ({
      selectedParcelles,
      setSelectedParcelles,
      isParcelleSelectionEnabled,
      setIsParcelleSelectionEnabled,
      handleParcelle,
      hoveredParcelle,
      handleHoveredParcelle,
    }),
    [
      selectedParcelles,
      isParcelleSelectionEnabled,
      handleParcelle,
      hoveredParcelle,
      handleHoveredParcelle,
    ]
  );

  return <ParcellesContext.Provider value={value} {...props} />;
}

export default ParcellesContext;
