import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { xor } from "lodash";
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
  hoveredParcelles: { id: string; featureId?: string }[];
  handleHoveredParcelles: (value: string[]) => void;
  handleParcelles: (value: string[]) => void;
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

  const [hoveredParcelles, setHoveredParcelles] = useState<
    {
      id: string;
      featureId?: string;
    }[]
  >([]);
  const [isParcelleSelectionEnabled, setIsParcelleSelectionEnabled] =
    useState<boolean>(false);
  const [selectedParcelles, setSelectedParcelles] = useState<string[]>([]);
  const prevHoveredParcelle = useRef<string[]>([]);

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

  const filterHighlightedWithParcelles = useCallback(
    (selectedParcelles) => {
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
    },
    [parcelles, map]
  );

  const filterHighlightedParcelles = useCallback(() => {
    filterHighlightedWithParcelles(selectedParcelles);
  }, [selectedParcelles, filterHighlightedWithParcelles]);

  const setHoverFeature = useCallback(
    (featureId: string, hover: boolean) => {
      map.setFeatureState(
        {
          source: CADASTRE_SOURCE,
          sourceLayer: CADASTRE_SOURCE_LAYER.PARCELLES,
          id: featureId,
        },
        { hover }
      );
    },
    [map]
  );

  const handleHoveredParcelles = useCallback(
    (parcelleHoveredIds: string[]) => {
      if (map) {
        // // ON ENLEVE LES HOVERED QUI NE LE SONT PLUS
        const oldHovereds: string[] = prevHoveredParcelle.current.filter(
          (id) => !parcelleHoveredIds.includes(id)
        );
        for (const oldHovered of oldHovereds) {
          const featureId: string = getHoveredFeatureId(map, oldHovered);
          setHoverFeature(featureId, false);
        }
        // ON AJOUTE ENSUITE LES NOUVEAU HOVERED
        const newHovereds: string[] = parcelleHoveredIds.filter(
          (id) => !prevHoveredParcelle.current.includes(id)
        );
        for (const newHovered of newHovereds) {
          const featureId: string = getHoveredFeatureId(map, newHovered);
          setHoverFeature(featureId, true);
        }
        prevHoveredParcelle.current = parcelleHoveredIds;
        const newoveredParcelles = parcelleHoveredIds.map((id) => ({
          id,
          featureId: getHoveredFeatureId(map, id),
        }));
        setHoveredParcelles(newoveredParcelles);
      } else if (
        prevHoveredParcelle?.current?.length > 0 &&
        isCadastreDisplayed
      ) {
        for (const featureId of prevHoveredParcelle.current) {
          setHoverFeature(featureId, false);
        }
        prevHoveredParcelle.current = [];
        setHoveredParcelles([]);
      }
    },
    [map, isCadastreDisplayed, setHoverFeature]
  );

  const handleParcelles = useCallback(
    (parcellesToggle: string[]) => {
      if (isParcelleSelectionEnabled) {
        const selectParcelles = xor(parcellesToggle, selectedParcelles);
        setSelectedParcelles(selectParcelles);
        filterHighlightedWithParcelles(selectParcelles);
        handleHoveredParcelles([]);
      }
    },
    [
      selectedParcelles,
      isParcelleSelectionEnabled,
      handleHoveredParcelles,
      filterHighlightedWithParcelles,
    ]
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
      handleParcelles,
      hoveredParcelles,
      handleHoveredParcelles,
    }),
    [
      selectedParcelles,
      isParcelleSelectionEnabled,
      handleParcelles,
      hoveredParcelles,
      handleHoveredParcelles,
    ]
  );

  return <ParcellesContext.Provider value={value} {...props} />;
}

export default ParcellesContext;
