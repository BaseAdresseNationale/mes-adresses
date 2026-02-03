"use client";

import LayoutContext from "@/contexts/layout";
import { GeolocationIcon, IconButton } from "evergreen-ui";
import { useContext, useState } from "react";
import styles from "./geolocation-control.module.css";
import type { Map as MaplibreMap } from "maplibre-gl";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface GeolocationControlProps {
  map: MaplibreMap;
}

function GeolocationControl({ map }: GeolocationControlProps) {
  const [isFlying, setIsFlying] = useState(false);
  const { pushToast } = useContext(LayoutContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const flyToCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 16,
        });
        setIsFlying(true);
        map.once("moveend", () => {
          setIsFlying(false);
        });
        matomoTrackEvent(
          MatomoEventCategory.MAP,
          MatomoEventAction[MatomoEventCategory.MAP].GEOLOCATE_ME
        );
      },
      (err) => {
        pushToast({
          title: "Erreur",
          message:
            "Nous n'arrivons pas à vous géolocaliser. Vérifiez les paramètres de votre navigateur.",
          intent: "danger",
        });
        console.error(
          `Erreur de géolocalisation (${err.code}): ${err.message}`
        );
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <IconButton
      className={styles.geolocationControl}
      title="Me géolocaliser"
      onClick={flyToCurrentPosition}
      height={29}
      width={29}
      {...(isFlying
        ? { disabled: true, isLoading: true }
        : {
            icon: GeolocationIcon,
          })}
    />
  );
}

export default GeolocationControl;
