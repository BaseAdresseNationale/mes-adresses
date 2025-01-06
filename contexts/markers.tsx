import React, {
  useState,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import { ObjectId } from "bson";

import MapContext from "@/contexts/map";
import { Position } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";

export interface Marker {
  id?: string;
  tooltip?: string | ReactNode;
  label?: string | ReactNode;
  type?: Position.type;
  latitude?: number;
  longitude?: number;
  isDisabled?: boolean;
  onClick?: () => void;
  color?: string;
  isMapMarker?: boolean;
  showTooltip?: boolean;
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

        return [
          ...prevMarkers,
          { id: new ObjectId().toHexString(), ...marker },
        ];
      });
    },
    [viewport]
  );

  const removeMarker = useCallback((markerId: string) => {
    setMarkers((prevMarkers) => {
      const filtre = prevMarkers.filter((marker) => marker.id !== markerId);
      return filtre;
    });
  }, []);

  const updateMarker = useCallback(
    (markerId: string, data: Partial<Marker>) => {
      setMarkers((markers) => {
        return markers.map((marker) => {
          if (marker.id === markerId) {
            return { id: markerId, ...marker, ...data };
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
