import { Voie, LineString } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import length from "@turf/length";

interface DrawContextType {
  drawEnabled: boolean;
  enableDraw: (voie: Voie) => void;
  disableDraw: () => void;
  enableDrawPolygon: () => void;
  disableDrawPolygon: () => void;
  modeId: string | null;
  setModeId: (value: string) => void;
  hint: string | null;
  setHint: (value: string) => void;
  data: GeoJSON.Feature<LineString> | null;
  setData: (value: GeoJSON.Feature<LineString> | null) => void;
  toggleRuler: () => void;
  isRulerEnabled: boolean;
}

const DrawContext = React.createContext<DrawContextType | null>(null);

export enum DrawMode {
  DRAW_LINE_STRING = "drawLineString",
  DRAW_POLYGON = "drawPolygon",
  RULER = "ruler",
}

export function DrawContextProvider(props: ChildrenProps) {
  const [drawEnabled, setDrawEnabled] = useState<boolean>(false);
  const [modeInterne, setModeInterne] = useState<DrawMode | null>(null);
  const [modeId, setModeId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [data, setData] = useState<GeoJSON.Feature<LineString> | null>(null);
  const [voie, setVoie] = useState<Voie | null>(null);

  const lineLength = useMemo(() => {
    if (!data) return 0;

    return length(data, { units: "kilometers" });
  }, [data]);

  const isRulerEnabled = modeInterne === DrawMode.RULER;

  const toggleRuler = useCallback(() => {
    if (isRulerEnabled) {
      setDrawEnabled(false);
      setModeInterne(null);
    } else {
      setDrawEnabled(true);
      setModeInterne(DrawMode.RULER);
    }
  }, [isRulerEnabled]);

  const enableDraw = useCallback((voie: Voie) => {
    setVoie(voie);
    setDrawEnabled(true);
    setModeInterne(DrawMode.DRAW_LINE_STRING);
  }, []);

  const enableDrawPolygon = useCallback(() => {
    setDrawEnabled(true);
    setModeId("drawPolygon");
    setModeInterne(DrawMode.DRAW_POLYGON);
  }, []);

  const disableDrawPolygon = useCallback(() => {
    setDrawEnabled(false);
    setModeId("drawPolygon");
    setModeInterne(null);
  }, []);

  useEffect(() => {
    if (voie?.trace) {
      setData({
        type: "Feature",
        properties: {},
        geometry: voie.trace as LineString,
      });
    } else {
      setData(null);
    }
  }, [voie]);

  useEffect(() => {
    if (drawEnabled) {
      switch (modeInterne) {
        case DrawMode.RULER:
          setModeId("drawLineString");
          setHint(
            lineLength > 0
              ? `Longueur : ${lineLength.toFixed(2)} km.`
              : "Cliquez sur la carte pour mesurer une distance. Double-cliquez pour terminer."
          );
          break;
        case DrawMode.DRAW_POLYGON:
          setModeId("drawPolygon");
          setHint(
            "Cliquez sur la carte pour indiquer le début du polygone, puis ajoutez de nouveaux points afin de tracer votre polygone. Une fois terminé, cliquez sur le dernier point afin d’indiquer la fin du polygone."
          );
          break;
        case DrawMode.DRAW_LINE_STRING:
          if (data) {
            // Edition mode
            setModeId("editing");
            setHint("Modifier le tracé de directement depuis la carte.");
          } else {
            // Creation mode
            setModeId("drawLineString");
            setHint(
              "Cliquez sur la carte pour indiquer le début de la voie, puis ajoutez de nouveaux points afin de tracer votre voie. Une fois terminé, cliquez sur le dernier point afin d’indiquer la fin de la voie."
            );
          }
          break;
        default:
          throw new Error("Mode de dessin inconnu");
      }
    } else {
      // Reset states
      setModeId(null);
      setHint(null);
      setVoie(null);
      setData(null);
    }
  }, [modeInterne, drawEnabled, data, modeId, lineLength]);

  const value = useMemo(
    () => ({
      drawEnabled,
      setDrawEnabled,
      enableDraw,
      disableDraw: () => {
        setDrawEnabled(false);
      },
      enableDrawPolygon,
      disableDrawPolygon,
      modeId,
      setModeId,
      hint,
      setHint,
      data,
      setData,
      toggleRuler,
      isRulerEnabled,
    }),
    [
      enableDraw,
      enableDrawPolygon,
      disableDrawPolygon,
      drawEnabled,
      setDrawEnabled,
      modeId,
      hint,
      data,
      toggleRuler,
      isRulerEnabled,
    ]
  );

  return <DrawContext.Provider value={value} {...props} />;
}

export const DrawContextConsumer = DrawContext.Consumer;

export default DrawContext;
