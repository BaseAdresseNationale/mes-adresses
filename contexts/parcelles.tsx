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
  highlightedParcelles: string[];
  setHighlightedParcelles: React.Dispatch<React.SetStateAction<string[]>>;
  isParcelleSelectionEnabled: boolean;
  setIsParcelleSelectionEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  hoveredParcelles: { id: string; featureId?: string }[];
  handleHoveredParcelles: (parcelleHoveredIds: string[]) => void;
  handleParcelles: (parcellesToggle: string[]) => void;
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
  const {
    baseLocale,
    commune,
    parcelles: selectedParcelles,
  } = useContext(BalDataContext);
  const [showSelectedParcelles, setShowSelectedParcelles] =
    useState<boolean>(true);
  const [isDiffMode, setIsDiffMode] = useState<boolean>(false);
  const [hoveredParcelles, setHoveredParcelles] = useState<
    {
      id: string;
      featureId?: string;
    }[]
  >([]);
  const [isParcelleSelectionEnabled, setIsParcelleSelectionEnabled] =
    useState<boolean>(false);
  const [highlightedParcelles, setHighlightedParcelles] = useState<string[]>(
    []
  );

  const prevHoveredParcelle = useRef<string[]>([]);

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
          const featureId: string = getFeatureId(map, oldHovered);
          setHoverFeature(featureId, false);
        }
        // ON AJOUTE ENSUITE LES NOUVEAU HOVERED
        const newHovereds: string[] = parcelleHoveredIds.filter(
          (id) => !prevHoveredParcelle.current.includes(id)
        );
        for (const newHovered of newHovereds) {
          const featureId: string = getFeatureId(map, newHovered);
          setHoverFeature(featureId, true);
        }
        prevHoveredParcelle.current = parcelleHoveredIds;
        const newoveredParcelles = parcelleHoveredIds.map((id) => ({
          id,
          featureId: getFeatureId(map, id),
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

  const filterHighlightedWithParcelles = useCallback(
    (selectedParcelles) => {
      if (selectedParcelles.length > 0) {
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
    [map]
  );

  const handleParcelles = useCallback(
    (parcellesToggle: string[]) => {
      if (isParcelleSelectionEnabled) {
        const highlightParcelles = xor(parcellesToggle, highlightedParcelles);
        setHighlightedParcelles(highlightParcelles);
        filterHighlightedWithParcelles(highlightParcelles);
        handleHoveredParcelles([]);
      }
    },
    [
      isParcelleSelectionEnabled,
      highlightedParcelles,
      filterHighlightedWithParcelles,
      handleHoveredParcelles,
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

  const setFilterMatch = useCallback(
    (layerId: string, value: string) => {
      map.setFilter(layerId, ["match", ["get", "commune"], value, true, false]);
    },
    [map]
  );

  const displayParcellesByCodeCommune = useCallback(
    (codeCommune: string) => {
      setFilterMatch(CADASTRE_LAYER.PARCELLES, codeCommune);
      setFilterMatch(CADASTRE_LAYER.PARCELLES_FILL, codeCommune);
    },
    [setFilterMatch]
  );

  const setFilterIn = useCallback(
    (layerId: string, value: string[]) => {
      map.setFilter(layerId, ["in", ["get", "commune"], ["literal", value]]);
    },
    [map]
  );

  const displayParcellesByCodeCommunes = useCallback(
    (codeCommunes: string[]) => {
      setFilterIn(CADASTRE_LAYER.PARCELLES, codeCommunes);
      setFilterIn(CADASTRE_LAYER.PARCELLES_FILL, codeCommunes);
    },
    [setFilterIn]
  );

  const reloadParcellesLayers = useCallback(() => {
    if (!map.isStyleLoaded()) {
      return;
    }
    // Les codes communes du cadastre ne correspondent pas toujours à ceux du COG
    // La variables codeCommunesCadastre est un mapping des code_insee vers les code commune du cadastre
    if (
      commune.codeCommunesCadastre &&
      commune.codeCommunesCadastre.length > 0
    ) {
      displayParcellesByCodeCommunes(commune.codeCommunesCadastre);
    } else {
      displayParcellesByCodeCommune(baseLocale.commune);
    }

    toggleCadastreVisibility();

    // Toggle selected parcelle visibility
    if (isCadastreDisplayed) {
      filterSelectedParcelles();
      filterHighlightedParcelles();
    }
  }, [
    map,
    commune.codeCommunesCadastre,
    toggleCadastreVisibility,
    isCadastreDisplayed,
    displayParcellesByCodeCommunes,
    displayParcellesByCodeCommune,
    baseLocale.commune,
    filterSelectedParcelles,
    filterHighlightedParcelles,
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
      handleParcelles,
      hoveredParcelles,
      handleHoveredParcelles,
      setShowSelectedParcelles,
      handleSetFeatureState,
      isDiffMode,
      setIsDiffMode,
    }),
    [
      highlightedParcelles,
      setHighlightedParcelles,
      isParcelleSelectionEnabled,
      handleParcelles,
      hoveredParcelles,
      handleHoveredParcelles,
      setShowSelectedParcelles,
      handleSetFeatureState,
      isDiffMode,
      setIsDiffMode,
    ]
  );

  return <ParcellesContext.Provider value={value} {...props} />;
}

export default ParcellesContext;
