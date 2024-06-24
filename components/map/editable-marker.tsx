import { useState, useCallback, useContext, useEffect, useMemo } from "react";
import { Marker, ViewState } from "react-map-gl";
import { Pane, MapMarkerIcon, Text } from "evergreen-ui";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import length from "@turf/length";
import * as helpers from "@turf/helpers";
import lineSlice from "@turf/line-slice";
import { Coord } from "@turf/helpers";

import MapContext from "@/contexts/map";
import MarkersContext from "@/contexts/markers";
import BalDataContext from "@/contexts/bal-data";
import { VOIE_TRACE_LINE } from "@/components/map/layers/tiles";

interface EditableMarkerProps {
  size?: number;
  style?: string;
  idVoie?: string;
  isToponyme: boolean;
  viewport: Partial<ViewState>;
}

function EditableMarker({
  size = 32,
  style = "vector",
  idVoie,
  isToponyme,
  viewport,
}: EditableMarkerProps) {
  const { map } = useContext(MapContext);
  const { markers, updateMarker, completeNumero, setSuggestedNumero } =
    useContext(MarkersContext);
  const { isEditing } = useContext(BalDataContext);

  const voie = useMemo(() => {
    if (idVoie) {
      return map
        .queryRenderedFeatures({ layers: [VOIE_TRACE_LINE] })
        .filter(({ geometry }) => geometry.type === "LineString")
        .find(({ properties }) => properties.id === idVoie);
    }
  }, [idVoie, map]);

  const computeSuggestedNumero = useCallback(
    (coordinates) => {
      if (!isToponyme && voie && voie.properties.originalGeometry) {
        // Is suggestion needed
        const geometry = JSON.parse(voie.properties.originalGeometry);
        const point = helpers.point(coordinates);
        const from = helpers.point(geometry.coordinates[0]);
        const to = nearestPointOnLine({ type: "Feature", geometry }, point, {
          units: "kilometers",
        });
        const slicedLine = length(lineSlice(from, to, geometry)) * 1000;

        return Number(slicedLine.toFixed());
      }
    },
    [isToponyme, voie]
  );

  const onDrag = useCallback(
    (event, idx) => {
      const { _id, type } = markers[idx];
      if (idx === 0) {
        const coords = [event.lngLat.lng, event.lngLat.lat];
        const suggestion = computeSuggestedNumero(coords);
        setSuggestedNumero(suggestion);
      }
      updateMarker(_id, {
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        type,
      });
    },
    [setSuggestedNumero, computeSuggestedNumero, markers, updateMarker]
  );

  useEffect(() => {
    if (isEditing) {
      const coordinates =
        markers.length > 0
          ? [markers[0].longitude, markers[0].latitude]
          : [viewport.longitude, viewport.latitude];
      const suggestion = computeSuggestedNumero(coordinates);
      setSuggestedNumero(suggestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEditing,
    markers.length,
    viewport,
    setSuggestedNumero,
    computeSuggestedNumero,
  ]);

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
          {completeNumero
            ? `${completeNumero} - ${marker.type}`
            : `${marker.type}`}
        </Text>

        <MapMarkerIcon
          filter="drop-shadow(1px 2px 1px rgba(0, 0, 0, .3))"
          color={
            marker.isDisabled
              ? "muted"
              : style === "vector"
                ? "info"
                : "success"
          }
          size={size}
        />
      </Pane>
    </Marker>
  ));
}

export default EditableMarker;
