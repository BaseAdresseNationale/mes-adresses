"use client";

import { LineString } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
import length from "@turf/length";
import { useParams } from "next/navigation";
import MapContext from "./map";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { defaultTheme } from "evergreen-ui";

const getStyles = (color = defaultTheme.colors.orange500) => [
  {
    id: "gl-draw-line",
    type: "line",
    filter: ["all", ["==", "$type", "LineString"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": color,
      "line-dasharray": [0.2, 2],
      "line-width": 4,
    },
  },
  {
    id: "gl-draw-polygon-fill",
    type: "fill",
    filter: ["all", ["==", "$type", "Polygon"]],
    paint: {
      "fill-color": color,
      "fill-outline-color": color,
      "fill-opacity": 0.1,
    },
  },
  {
    id: "gl-draw-polygon-midpoint",
    type: "circle",
    filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
    paint: {
      "circle-radius": 5,
      "circle-color": color,
    },
  },
  {
    id: "gl-draw-polygon-stroke-active",
    type: "line",
    filter: ["all", ["==", "$type", "Polygon"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": color,
      "line-dasharray": [0.2, 2],
      "line-width": 4,
    },
  },
  {
    id: "gl-draw-polygon-and-line-vertex-halo-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
    paint: {
      "circle-radius": 10,
      "circle-color": "#FFF",
    },
  },
  {
    id: "gl-draw-polygon-and-line-vertex-active",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
    paint: {
      "circle-radius": 8,
      "circle-color": color,
    },
  },
];

const draw: MapboxDraw = new MapboxDraw({
  displayControlsDefault: false,
  defaultMode: "simple_select",
  styles: getStyles(),
});

interface DrawContextType {
  drawMode: DrawMode | null;
  setDrawMode: (value: DrawMode) => void;
  hint: string | null;
  setHint: (value: string) => void;
  data: GeoJSON.Feature<LineString> | null;
  setData: (value: GeoJSON.Feature<LineString> | null) => void;
}

const DrawContext = React.createContext<DrawContextType | null>(null);

export enum DrawMode {
  DRAW_METRIC_VOIE = "drawMetricVoie",
  DRAW_NUMEROS_TO_TOPONYME_POLYGONE = "drawNumerosToToponymePolygone",
  RULER = "ruler",
}

export function DrawContextProvider(props: ChildrenProps) {
  const [drawMode, setDrawMode] = useState<DrawMode | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [data, setData] = useState<GeoJSON.Feature<LineString> | null>(null);

  const params = useParams();
  const { map, isMapLoaded } = useContext(MapContext)!;

  // Disable draw on route change
  useEffect(() => {
    const cb = () => {
      setDrawMode(null);
    };

    cb();
  }, [drawMode, setDrawMode, params]);

  const onCreate = useCallback(
    ({ features }) => {
      if (features) {
        setData(features[0]);
      }
    },
    [setData]
  );

  const onModeChange = useCallback(({ mode }) => {
    const { features } = draw.getAll();
    if (mode === "simple_select" && features.length > 0) {
      draw.changeMode("direct_select", { featureId: features[0].id });
    }
  }, []);

  useEffect(() => {
    map?.addControl(draw);

    map?.on("draw.create", onCreate);
    map?.on("draw.update", onCreate);
    map?.on("draw.modechange", onModeChange);

    return () => {
      map?.off("draw.create", onCreate);
      map?.off("draw.update", onCreate);
      map?.off("draw.modechange", onModeChange);
    };
  }, [map, onCreate, onModeChange]);

  useEffect(() => {
    if (!isMapLoaded) {
      return;
    }

    if (drawMode !== null) {
      switch (drawMode) {
        case DrawMode.RULER:
          if (!data) {
            draw.changeMode("draw_line_string");
            setHint(
              "Cliquez sur la carte pour mesurer une distance. Double-cliquez pour terminer."
            );
          } else {
            draw.changeMode("direct_select", { featureId: data.id });
            const lineLength = length(data, { units: "meters" });
            setHint(`Longueur : ${Math.round(lineLength)} m.`);
          }
          break;
        case DrawMode.DRAW_NUMEROS_TO_TOPONYME_POLYGONE:
          draw.changeMode("draw_polygon");
          if (!data) {
            setHint(
              "Cliquez sur la carte pour indiquer le début du polygone, puis ajoutez de nouveaux points afin de tracer votre polygone. Une fois terminé, cliquez sur le dernier point afin d’indiquer la fin du polygone."
            );
          } else {
            draw.changeMode("direct_select", { featureId: data.id });
            setHint(
              "Vous pouvez éditer le polygone en déplaçant les points ou en ajoutant de nouveaux points en cliquant sur le contour du polygone."
            );
          }
          break;
        case DrawMode.DRAW_METRIC_VOIE:
          if (!data) {
            draw.changeMode("draw_line_string");
            setHint(
              "Cliquez sur la carte pour indiquer le début de la voie, puis ajoutez de nouveaux points afin de tracer votre voie. Une fois terminé, cliquez sur le dernier point afin d’indiquer la fin de la voie."
            );
          } else {
            const featureId = data.id || draw.add(data)[0];
            draw.changeMode("direct_select", { featureId });
            setHint(
              "Vous pouvez éditer le tracé en déplaçant les points ou en ajoutant de nouveaux points en cliquant sur le tracé."
            );
          }
          break;
        default:
          throw new Error("Mode de dessin inconnu");
      }
    } else {
      // Reset states
      draw.deleteAll();
      draw.changeMode("simple_select");
      setHint(null);
      setData(null);
    }
  }, [drawMode, data, isMapLoaded]);

  const value = useMemo(
    () => ({
      drawMode,
      setDrawMode,
      hint,
      setHint,
      data,
      setData,
    }),
    [drawMode, setDrawMode, hint, data]
  );

  return <DrawContext.Provider value={value} {...props} />;
}

export const DrawContextConsumer = DrawContext.Consumer;

export default DrawContext;
