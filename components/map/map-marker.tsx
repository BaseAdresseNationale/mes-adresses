import React, { useEffect, useRef, useState } from "react";
import { Marker, Popup } from "react-map-gl/maplibre";
import { MapMarkerIcon, Pane, Text } from "evergreen-ui";
import { Marker as MarkerType } from "contexts/markers";

interface MapMarkerProps {
  size?: number;
  marker: MarkerType;
}

function MapMarker({ size = 32, marker }: MapMarkerProps) {
  const markerRef = useRef(null);
  const {
    id,
    tooltip,
    color,
    latitude,
    longitude,
    onClick,
    showTooltip,
    label,
  } = marker;

  const [_showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const element = markerRef.current.getElement();
    if (element) {
      const onMouseEnter = () => {
        setShowTooltip(true);
      };
      const onMouseLeave = () => {
        setShowTooltip(false);
      };

      element.addEventListener("mouseenter", onMouseEnter);
      element.addEventListener("mouseleave", onMouseLeave);

      return () => {
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, [markerRef]);

  return (
    <>
      {!!tooltip && (showTooltip || _showTooltip) && (
        <Popup
          longitude={longitude}
          latitude={latitude}
          closeButton={false}
          anchor="bottom"
          offset={20}
        >
          {tooltip}
        </Popup>
      )}
      <Marker
        ref={markerRef}
        key={id}
        longitude={longitude}
        latitude={latitude}
        style={{ cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
      >
        {label && (
          <Pane>
            <Text
              position="absolute"
              top={-20}
              transform={`translate(calc(-50% + ${size / 2}px), -5px)`} // Place label on top of marker
              borderRadius={20}
              backgroundColor="rgba(0, 0, 0, 0.7)"
              color="white"
              paddingX={8}
              paddingY={1}
              fontSize={10}
              whiteSpace="nowrap"
            >
              {label}
            </Text>
          </Pane>
        )}

        <MapMarkerIcon
          filter="drop-shadow(1px 2px 1px rgba(0, 0, 0, .3))"
          color={color}
          size={size}
        />
      </Marker>
    </>
  );
}

export default React.memo(MapMarker);
