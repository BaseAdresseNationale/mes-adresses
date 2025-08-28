import { GeolocationIcon, IconButton } from "evergreen-ui";

interface GeolocationControlProps {
  map: any;
}

function GeolocationControl({ map }: GeolocationControlProps) {
  const flyToCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 16,
          essential: true,
        });
      },
      (err) => {
        console.error(
          `Géolocalisation impossible (${err.code}): ${err.message}`
        );
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  };

  return (
    <IconButton
      onClick={flyToCurrentPosition}
      height={29}
      width={29}
      icon={GeolocationIcon}
      title="Me géolocaliser"
    />
  );
}

export default GeolocationControl;
