import { Voie, LineString } from "@/lib/openapi";
import { ChildrenProps } from "@/types/context";
import React, { useState, useEffect, useMemo, useCallback } from "react";

interface DrawContextType {
  drawEnabled: boolean;
  enableDraw: (voie: Voie) => void;
  disableDraw: () => void;
  modeId: string | null;
  setModeId: (value: string) => void;
  hint: string | null;
  setHint: (value: string) => void;
  data: GeoJSON.Feature<LineString> | null;
  setData: (value: GeoJSON.Feature<LineString> | null) => void;
}

const DrawContext = React.createContext<DrawContextType | null>(null);

export function DrawContextProvider(props: ChildrenProps) {
  const [drawEnabled, setDrawEnabled] = useState<boolean>(false);
  const [modeId, setModeId] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [data, setData] = useState<GeoJSON.Feature<LineString> | null>(null);
  const [voie, setVoie] = useState<Voie | null>(null);

  const enableDraw = useCallback((voie: Voie) => {
    setVoie(voie);
    setDrawEnabled(true);
  }, []);

  useEffect(() => {
    if (voie?.trace) {
      setData({
        type: "Feature",
        properties: {},
        geometry: voie.trace,
      });
    } else {
      setData(null);
    }
  }, [voie]);

  useEffect(() => {
    if (drawEnabled) {
      if (data) {
        // Edition mode
        setModeId("editing");
        setHint("Modifier le tracé de la voie directement depuis la carte.");
      } else {
        // Creation mode
        setModeId("drawLineString");
        setHint(
          "Cliquez sur la carte pour indiquer le début de la voie, puis ajouter de nouveaux points afin de tracer votre voie. Une fois terminé, cliquez sur le dernier point afin d’indiquer la fin de la voie."
        );
      }
    } else {
      // Reset states
      setModeId(null);
      setHint(null);
      setVoie(null);
      setData(null);
    }
  }, [drawEnabled, data]);

  const value = useMemo(
    () => ({
      drawEnabled,
      enableDraw,
      disableDraw: () => {
        setDrawEnabled(false);
      },
      modeId,
      setModeId,
      hint,
      setHint,
      data,
      setData,
    }),
    [enableDraw, drawEnabled, modeId, hint, data]
  );

  return <DrawContext.Provider value={value} {...props} />;
}

export const DrawContextConsumer = DrawContext.Consumer;

export default DrawContext;
