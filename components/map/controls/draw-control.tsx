import { useEffect, useCallback, useContext } from "react";
import DrawContext from "@/contexts/draw";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { defaultTheme } from "evergreen-ui";

const draw = new MapboxDraw({
  displayControlsDefault: false,
  defaultMode: "simple_select",
  styles: [
    // ACTIVE (being drawn)
    // line stroke
    {
      id: "gl-draw-line",
      type: "line",
      filter: ["all", ["==", "$type", "LineString"]],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": defaultTheme.colors.blue500,
        "line-dasharray": [0.2, 2],
        "line-width": 4,
      },
    },
    // polygon fill
    {
      id: "gl-draw-polygon-fill",
      type: "fill",
      filter: ["all", ["==", "$type", "Polygon"]],
      paint: {
        "fill-color": defaultTheme.colors.blue500,
        "fill-outline-color": defaultTheme.colors.blue500,
        "fill-opacity": 0.1,
      },
    },
    // polygon mid points
    {
      id: "gl-draw-polygon-midpoint",
      type: "circle",
      filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
      paint: {
        "circle-radius": 5,
        "circle-color": defaultTheme.colors.blue500,
      },
    },
    // polygon outline stroke
    // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
    {
      id: "gl-draw-polygon-stroke-active",
      type: "line",
      filter: ["all", ["==", "$type", "Polygon"]],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": defaultTheme.colors.blue500,
        "line-dasharray": [0.2, 2],
        "line-width": 4,
      },
    },
    // vertex point halos
    {
      id: "gl-draw-polygon-and-line-vertex-halo-active",
      type: "circle",
      filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
      paint: {
        "circle-radius": 10,
        "circle-color": "#FFF",
      },
    },
    // vertex points
    {
      id: "gl-draw-polygon-and-line-vertex-active",
      type: "circle",
      filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
      paint: {
        "circle-radius": 8,
        "circle-color": defaultTheme.colors.blue500,
      },
    },
  ],
});

interface DrawControlProps {
  map: any;
  isMapLoaded: boolean;
}

function DrawControl({ map, isMapLoaded }: DrawControlProps) {
  const { drawEnabled, data, setData, modeId } = useContext(DrawContext);

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
    if (isMapLoaded) {
      if (drawEnabled) {
        if (modeId === "drawPolygon") {
          draw.changeMode("draw_polygon");
        } else if (modeId === "drawLineString") {
          draw.changeMode("draw_line_string");
        } else if (modeId === "editing" && data) {
          if (data.id) {
            // SI LE MODE_ID PASSE EN MODE EDITING ON PASSE EN MODE DIRECT_SELECT
            draw.changeMode("direct_select", { featureId: data.id });
          } else {
            // SI UNE LINE_STRING EXISTE DEJA, ON LA SET ET PASSE EN MODE EDITION
            const featureIds = draw.add(data);
            draw.changeMode("direct_select", { featureId: featureIds[0] });
          }
        }
      } else {
        draw.deleteAll();
        draw.changeMode("simple_select");
      }
    }
  }, [drawEnabled, map, isMapLoaded, modeId, data]);

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
    if (!data && isMapLoaded) {
      draw.deleteAll();
    }
  }, [data, isMapLoaded]);

  return null;
}

export default DrawControl;
