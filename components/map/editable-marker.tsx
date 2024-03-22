import { useCallback, useContext, useMemo } from "react";
import { Marker } from "react-map-gl";
import { Pane, MapMarkerIcon, Text } from "evergreen-ui";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import length from "@turf/length";
import * as helpers from "@turf/helpers";
import lineSlice from "@turf/line-slice";

import MapContext from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import { VOIE_TRACE_LINE } from "@/components/map/layers/tiles";

interface EditableMarkerProps {
  isToponyme: Boolean;
  idVoie?: string;
  size?: number;
  style?: String;
}

function EditableMarker({
  isToponyme,
  size = 32,
  style = "vector",
  idVoie = null,
}: EditableMarkerProps) {
  const { map } = useContext(MapContext);
  const { markers, updateMarker, suggestedNumero, setSuggestedNumero } =
    useContext(MarkersContext);

  const voie = useMemo(() => {
    if (idVoie) {
      return map
        .queryRenderedFeatures({ layers: [VOIE_TRACE_LINE] })
        .filter(({ geometry }) => geometry.type === "LineString")
        .find(({ properties }) => properties.id === idVoie);
    }
  }, [idVoie, map]);

  // computeSuggestedNumero MARCHE SI LA FEATURE voie EXISTE
  const computeSuggestedNumero = useCallback(
    (coordinates: number[]) => {
      if (!isToponyme && voie && voie.properties.originalGeometry) {
        // Is suggestion needed
        const geometry = JSON.parse(voie.properties.originalGeometry);
        const point = helpers.point(coordinates);
        const from = helpers.point(geometry.coordinates[0]);
        const to = nearestPointOnLine({ type: "Feature", geometry }, point, {
          units: "kilometers",
        });
        const slicedLine: number = length(lineSlice(from, to, geometry)) * 1000;
        return Number(slicedLine.toFixed());
      }
    },
    [isToponyme, voie]
  );

  const onDrag = useCallback(
    (event, idx) => {
      const { _id, type } = markers[idx];
      const coords: number[] = [event.lngLat.lng, event.lngLat.lat];
      const suggestion: number = computeSuggestedNumero(coords);
      setSuggestedNumero(suggestion);
      updateMarker(_id, {
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        type,
      });
    },
    [computeSuggestedNumero, markers, updateMarker, setSuggestedNumero]
  );

  return markers.map((marker, idx) => (
    <Marker
      key={marker._id}
      longitude={marker.longitude}
      latitude={marker.latitude}
      draggable
      onDrag={(e) => onDrag(e, idx)}
      onDragEnd={(e) => onDrag(e, idx)}
    >
      <Pane>
        <Text
          position="absolute"
          top={-30}
          transform={`translate(calc(-50% + ${size / 2}px), -5px)`} // Place label on top of marker
          borderRadius={20}
          backgroundColor="rgba(0, 0, 0, 0.7)"
          color="white"
          paddingX={8}
          paddingY={1}
          fontSize={10}
          whiteSpace="nowrap"
        >
          {suggestedNumero
            ? `${suggestedNumero} - ${marker.type}`
            : `${marker.type}`}
        </Text>

        <MapMarkerIcon
          filter="drop-shadow(1px 2px 1px rgba(0, 0, 0, .3))"
          color={style === "vector" ? "info" : "success"}
          size={size}
        />
      </Pane>
    </Marker>
  ));
}

export default EditableMarker;
