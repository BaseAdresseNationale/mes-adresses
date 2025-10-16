import { CrossIcon, IconButton } from "evergreen-ui";
import Image from "next/image";
import type { Map as MaplibreMap } from "maplibre-gl";
import { useEffect } from "react";

interface PanoramaxControlProps {
  map: MaplibreMap | null;
  setShowPanoramax: (show: boolean) => void;
  showPanoramax: boolean;
}

function PanoramaxControl({
  map,
  setShowPanoramax,
  showPanoramax,
}: PanoramaxControlProps) {
  useEffect(() => {
    if (map) {
      // Rerender the map to avoid tiles remaining on screen
      map.zoomTo(map.getZoom());
    }
  }, [map, showPanoramax]);

  return showPanoramax ? (
    <IconButton
      height={29}
      width={29}
      icon={CrossIcon}
      onClick={() => setShowPanoramax(false)}
      title="Fermer Panoramax"
    />
  ) : (
    <IconButton
      onClick={() => setShowPanoramax(true)}
      height={29}
      width={29}
      icon={
        <Image
          src="/static/images/panoramax.svg"
          alt="Ruler icon"
          width={20}
          height={20}
        />
      }
      title="Ouvrir Panoramax"
    />
  );
}

export default PanoramaxControl;
