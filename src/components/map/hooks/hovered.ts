"use client";

import { useCallback, useContext, useRef, useState } from "react";

import ParcellesContext from "@/contexts/parcelles";
import { LAYERS_SOURCE } from "@/components/map/layers/tiles";
import { PANORAMAX_LAYERS_SOURCE } from "../layers/panoramax";

function useHovered(map) {
  const hovered = useRef<{
    id: string;
    source: "tiles" | "cadastre";
    sourceLayer: typeof LAYERS_SOURCE;
  }>(undefined);
  const { handleHoveredParcelles } = useContext(ParcellesContext);
  const [featureHovered, setFeatureHovered] = useState(null);

  const handleRelatedNumerosForVoie = (map, idVoie, isHovered) => {
    const numerosFeatures = map.querySourceFeatures("tiles", {
      sourceLayer: LAYERS_SOURCE.NUMEROS_POINTS,
      filter: ["==", ["get", "idVoie"], idVoie],
    });
    numerosFeatures.forEach(({ id }) => {
      map.setFeatureState(
        { source: "tiles", sourceLayer: LAYERS_SOURCE.NUMEROS_POINTS, id },
        { hover: isHovered },
      );
    });
    map.setFeatureState(
      {
        source: "tiles",
        sourceLayer: LAYERS_SOURCE.VOIES_LINES_STRINGS,
        id: idVoie,
      },
      { hover: isHovered },
    );
  };

  const handleRelatedNumerosForToponyme = (map, idToponyme, isHovered) => {
    const numerosFeatures = map.querySourceFeatures("tiles", {
      sourceLayer: LAYERS_SOURCE.NUMEROS_POINTS,
      filter: ["==", ["get", "idToponyme"], idToponyme],
    });

    numerosFeatures.forEach(({ id }) => {
      map.setFeatureState(
        { source: "tiles", sourceLayer: LAYERS_SOURCE.NUMEROS_POINTS, id },
        { hover: isHovered },
      );
    });
  };

  const handleRelatedVoiePoints = (map, id, isHovered) => {
    map.setFeatureState(
      { source: "tiles", sourceLayer: LAYERS_SOURCE.VOIES_POINTS, id },
      { hover: isHovered },
    );
  };

  const handleRelatedToponymePoints = (map, id, isHovered) => {
    map.setFeatureState(
      { source: "tiles", sourceLayer: LAYERS_SOURCE.TOPONYME_POINTS, id },
      { hover: isHovered },
    );
  };

  // Highlight related features
  const handleRelatedFeatures = (map, feature, isHovered) => {
    const { source, sourceLayer, properties } = feature;
    if (source === "tiles") {
      if (sourceLayer === LAYERS_SOURCE.VOIES_POINTS) {
        handleRelatedNumerosForVoie(map, properties.id, isHovered);
      } else if (sourceLayer === LAYERS_SOURCE.TOPONYME_POINTS) {
        handleRelatedNumerosForToponyme(map, properties.id, isHovered);
      } else if (sourceLayer === LAYERS_SOURCE.VOIES_LINES_STRINGS) {
        handleRelatedVoiePoints(map, properties.id, isHovered);
      } else if (sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS) {
        handleRelatedVoiePoints(map, properties.idVoie, isHovered);
        if (properties.idToponyme) {
          handleRelatedToponymePoints(map, properties.idToponyme, isHovered);
        }
      }
    }
  };

  const handleHover = useCallback(
    (event) => {
      const feature = event && event.features && event.features[0];
      if (feature) {
        if (feature.sourceLayer === PANORAMAX_LAYERS_SOURCE.PICTURES) {
          feature.id = feature.properties.id;
        }

        const { source, id, sourceLayer } = feature;

        const parcelles = event.features.filter(
          ({ source, sourceLayer, layer }) =>
            source === "cadastre" &&
            sourceLayer === "parcelles" &&
            layer?.id === "parcelles-fill",
        );

        if (source === "cadastre") {
          handleHoveredParcelles(
            parcelles.map(({ properties }) => properties.id),
          );
        }

        if (hovered.current) {
          map.setFeatureState(
            {
              source: hovered.current.source,
              id: hovered.current.id,
              sourceLayer: hovered.current.sourceLayer,
            },
            { hover: false },
          );
          handleRelatedFeatures(map, hovered.current, false);
          setFeatureHovered(null);
        }

        hovered.current = feature;

        // Highlight hovered features
        map.setFeatureState({ source, id, sourceLayer }, { hover: true });
        handleRelatedFeatures(map, feature, true);
        if (
          sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS ||
          sourceLayer === LAYERS_SOURCE.VOIES_POINTS ||
          sourceLayer === LAYERS_SOURCE.VOIES_LINES_STRINGS ||
          sourceLayer === LAYERS_SOURCE.TOPONYME_POINTS ||
          sourceLayer === PANORAMAX_LAYERS_SOURCE.PICTURES
        ) {
          setFeatureHovered(feature);
        }
      }
    },
    [map, handleHoveredParcelles],
  );

  const handleMouseLeave = useCallback(() => {
    if (hovered.current) {
      const { id, source, sourceLayer } = hovered.current;
      map.setFeatureState({ source, sourceLayer, id }, { hover: false });
      handleRelatedFeatures(map, hovered.current, false);
      setFeatureHovered(null);

      if (source === "cadastre") {
        handleHoveredParcelles([]);
      }
    }

    hovered.current = null;
  }, [map, handleHoveredParcelles]);

  return [handleHover, handleMouseLeave, featureHovered];
}

export default useHovered;
