import MapContext from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import { Alert } from "@/lib/openapi-signalement";
import { useContext, useEffect } from "react";
import { signalementTypeMap } from "../signalement-type-badge";

export function useAlertMap(alert: Alert, showMarker = true) {
  const { map } = useContext(MapContext);
  const { addMarker, disableMarkers } = useContext(MarkersContext);

  useEffect(() => {
    if (!map || !alert.point) {
      return;
    }

    map.flyTo({
      center: [alert.point.coordinates[0], alert.point.coordinates[1]],
      offset: [0, 0],
      zoom: 20,
      screenSpeed: 2,
    });

    if (showMarker) {
      addMarker({
        id: alert.id,
        isMapMarker: true,
        isDisabled: true,
        color: signalementTypeMap[alert.type]?.color || "red",
        longitude: alert.point.coordinates[0],
        latitude: alert.point.coordinates[1],
      });
    }

    return () => {
      disableMarkers();
    };
  }, [alert, map, showMarker]);
}
