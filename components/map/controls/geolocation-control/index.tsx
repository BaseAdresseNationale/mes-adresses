import LayoutContext from "@/contexts/layout";
import { GeolocationIcon, IconButton } from "evergreen-ui";
import { useContext, useState } from "react";
import styles from "./geolocation-control.module.css";

interface GeolocationControlProps {
  map: any;
}

function GeolocationControl({ map }: GeolocationControlProps) {
  const [isFlying, setIsFlying] = useState(false);
  const { pushToast } = useContext(LayoutContext);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 16,
        });
        map.once("moveend", () => {
          setIsFlying(false);
        });
        setIsFlying(true);
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
      onClick={getLocation}
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
