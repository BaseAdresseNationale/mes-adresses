import React, { useState, useCallback, useContext, useMemo } from "react";
import { uniqueId } from "lodash";

import MapContext from "@/contexts/map";
import { Position } from "@/lib/openapi";
import { ChildrenProps } from "@/types/context";

export interface Marker {
  _id?: string;
  label?: string;
  type?: Position.type;
  latitude?: number;
  longitude?: number;
  isDisabled?: boolean;
  onClick?: () => void;
  color?: string;
  isMapMarker?: boolean;
}

interface MarkersContextType {
  markers: Marker[];
  addMarker: (value: Partial<Marker>) => void;
  removeMarker: (id: string) => void;
  updateMarker: (id: string, value: Partial<Marker>) => void;
  completeNumero: string | null;
  setCompleteNumero: (value: string) => void;
  disableMarkers: () => void;
  suggestedNumero: number | null;
  setSuggestedNumero: (value: number) => void;
}

const MarkersContext = React.createContext<MarkersContextType | null>(null);

export function MarkersContextProvider(props: ChildrenProps) {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [completeNumero, setCompleteNumero] = useState<string | null>(null);
  const [suggestedNumero, setSuggestedNumero] = useState<number | null>(null);

  const { viewport } = useContext(MapContext);

  const disableMarkers = useCallback(() => {
    setMarkers([]);
    setCompleteNumero(null);
    setSuggestedNumero(null);
  }, []);

  const addMarker = useCallback(
    (data: Partial<Marker>) => {
      let marker: Marker = { ...data };
      setMarkers((prevMarkers) => {
        if (!marker.latitude || !marker.longitude) {
          const { latitude, longitude } = viewport;
          marker = { ...marker, longitude, latitude };
        }

        return [...prevMarkers, { _id: uniqueId(), ...marker }];
      });
    },
    [viewport]
  );

  const removeMarker = useCallback((markerId: string) => {
    setMarkers((prevMarkers) => {
      const filtre = prevMarkers.filter((marker) => marker._id !== markerId);
      return filtre;
    });
  }, []);

  const updateMarker = useCallback(
    (markerId: string, data: Partial<Marker>) => {
      setMarkers((markers) => {
        return markers.map((marker) => {
          if (marker._id === markerId) {
            return { _id: markerId, ...data };
          }

          return marker;
        });
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      markers,
      addMarker,
      removeMarker,
      updateMarker,
      completeNumero,
      setCompleteNumero,
      disableMarkers,
      suggestedNumero,
      setSuggestedNumero,
    }),
    [
      markers,
      completeNumero,
      addMarker,
      removeMarker,
      updateMarker,
      disableMarkers,
      suggestedNumero,
    ]
  );

  return <MarkersContext.Provider value={value} {...props} />;
}

export const MarkerContextConsumer = MarkersContext.Consumer;

export default MarkersContext;
