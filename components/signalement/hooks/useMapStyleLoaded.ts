import MapContext from "@/contexts/map";
import { useContext, useEffect, useState } from "react";

export const useMapStyleLoaded = () => {
  const { map } = useContext(MapContext);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (!map) {
      return;
    }

    const onLoading = () => {
      setIsMapLoaded(false);
    };

    const onLoaded = () => {
      setIsMapLoaded(true);
    };

    map.on("styledataloading", onLoading);
    map.on("sourcedataloading", onLoading);
    map.on("idle", onLoaded);

    return () => {
      map.off("styledataloading", onLoading);
      map.off("sourcedataloading", onLoading);
      map.off("idle", onLoaded);
    };
  }, [map]);

  return { isMapLoaded };
};
