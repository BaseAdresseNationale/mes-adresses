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
  highlightedParcelles: string[];
  setHighlightedParcelles: React.Dispatch<React.SetStateAction<string[]>>;
  isParcelleSelectionEnabled: boolean;
  setIsParcelleSelectionEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  hoveredParcelle: { id: string; featureId?: string } | null;
  handleHoveredParcelle: (
    value: { id: string; featureId?: string } | null
  ) => void;
  handleParcelle: (value: string) => void;
  setShowSelectedParcelles?: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetFeatureState: (
    parcelleId: string,
    state: { [key: string]: any }
  ) => void;
  isDiffMode?: boolean;
  setIsDiffMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ParcellesContext = React.createContext<ParcellesContextType | null>(null);

function getFeatureId(map: MaplibreMap, id: string): string | undefined {
  const [feature] = map.querySourceFeatures(CADASTRE_SOURCE, {
    sourceLayer: CADASTRE_SOURCE_LAYER.PARCELLES,
    filter: ["==", ["get", "id"], id],
  });

  return (feature?.id as string) || undefined;
}

export function ParcellesContextProvider(props: ChildrenProps) {
  const { map, isCadastreDisplayed, isStyleLoaded } = useContext(MapContext);
  const { baseLocale, parcelles: selectedParcelles } =
    useContext(BalDataContext);
  const [showSelectedParcelles, setShowSelectedParcelles] =
    useState<boolean>(true);
  const [isDiffMode, setIsDiffMode] = useState<boolean>(false);
  const [hoveredParcelle, setHoveredParcelle] = useState<{
    id: string;
    featureId?: string;
  } | null>(null);
  const [isParcelleSelectionEnabled, setIsParcelleSelectionEnabled] =
    useState<boolean>(false);
  const [highlightedParcelles, setHighlightedParcelles] = useState<string[]>(
    []
  );

  const prevHoveredParcelle = useRef<string | undefined>();

  const handleHoveredParcelle = useCallback(
    (hovered: { id: string; featureId?: string } | null) => {
      if (map && hovered) {
        const featureId: string | undefined =
          hovered.featureId || getFeatureId(map, hovered.id);

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

  const handleSetFeatureState = useCallback(
    (parcelleId: string, state: { [key: string]: boolean }) => {
      if (map) {
        const featureId = getFeatureId(map, parcelleId);
        if (!featureId) {
          return;
        }

        map.setFeatureState(
          {
            source: CADASTRE_SOURCE,
            sourceLayer: CADASTRE_SOURCE_LAYER.PARCELLES,
            id: featureId,
          },
          state
        );
      }
    },
    [map]
  );

  const handleParcelle = useCallback(
    (parcelle: string) => {
      if (isParcelleSelectionEnabled) {
        setHighlightedParcelles((parcelles: string[]) => {
          if (parcelles.includes(parcelle)) {
            return parcelles.filter((id) => id !== parcelle);
          }

          return [...parcelles, parcelle];
        });
        handleHoveredParcelle(null);
      }
    },
    [isParcelleSelectionEnabled, handleHoveredParcelle]
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
    if (selectedParcelles.length > 0 && showSelectedParcelles) {
      const exps: ExpressionSpecification[] = selectedParcelles.map(
        (id: string) => ["==", ["get", "id"], id]
      );
      map.setFilter(CADASTRE_LAYER.PARCELLES_SELECTED, ["any", ...exps]);
    } else {
      map.setFilter(CADASTRE_LAYER.PARCELLES_SELECTED, [
        "==",
        ["get", "id"],
        "",
      ]);
    }
  }, [map, selectedParcelles, showSelectedParcelles]);

  const filterHighlightedParcelles = useCallback(() => {
    if (highlightedParcelles.length > 0) {
      const exps: ExpressionSpecification[] = highlightedParcelles.map((id) => [
        "==",
        ["get", "id"],
        id,
      ]);
      map.setFilter(
        isDiffMode
          ? CADASTRE_LAYER.PARCELLE_HIGHLIGHTED_DIFF_MODE
          : CADASTRE_LAYER.PARCELLE_HIGHLIGHTED,
        ["any", ...exps]
      );
    } else {
      map.setFilter(
        isDiffMode
          ? CADASTRE_LAYER.PARCELLE_HIGHLIGHTED_DIFF_MODE
          : CADASTRE_LAYER.PARCELLE_HIGHLIGHTED,
        ["==", ["get", "id"], ""]
      );
    }
  }, [map, highlightedParcelles, isDiffMode]);

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
      setHighlightedParcelles([]);
    }
  }, [isParcelleSelectionEnabled, isStyleLoaded]);

  useEffect(() => {
    if (isStyleLoaded) {
      reloadParcellesLayers();
    }
  }, [isStyleLoaded, reloadParcellesLayers]);

  const value = useMemo(
    () => ({
      highlightedParcelles,
      setHighlightedParcelles,
      isParcelleSelectionEnabled,
      setIsParcelleSelectionEnabled,
      handleParcelle,
      hoveredParcelle,
      handleHoveredParcelle,
      setShowSelectedParcelles,
      handleSetFeatureState,
      isDiffMode,
      setIsDiffMode,
    }),
    [
      highlightedParcelles,
      setHighlightedParcelles,
      isParcelleSelectionEnabled,
      handleParcelle,
      hoveredParcelle,
      handleHoveredParcelle,
      setShowSelectedParcelles,
      handleSetFeatureState,
      isDiffMode,
      setIsDiffMode,
    ]
  );

  return <ParcellesContext.Provider value={value} {...props} />;
}

export default ParcellesContext;
