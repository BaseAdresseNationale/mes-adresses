import { useMemo, useContext, useState, useEffect, useCallback } from "react";
import bbox from "@turf/bbox";

import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";
import { useRouter } from "next/router";
import { CommuneType } from "@/types/commune";
import { Toponyme, Voie } from "@/lib/openapi";

function useBounds(commune: CommuneType, voie: Voie, toponyme: Toponyme) {
  const communeBounds = useMemo(
    () => (commune.contour ? bbox(commune.contour) : null),
    [commune.contour]
  );
  const { editingItem } = useContext(BalDataContext);
  const { map, isTileSourceLoaded } = useContext(MapContext);
  const [wasCenteredOnCommuneOnce, setWasCenteredOnCommuneOnce] =
    useState(false);
  const [bounds, setBounds] = useState(communeBounds);

  const router = useRouter();

  const setBoundsItem = useCallback(
    (item) => {
      if (map && item && item.trace) {
        setBounds(bbox(item.trace));
      } else if (map && item && item.bbox) {
        setBounds(item.bbox);
      }
    },
    [map, setBounds]
  );

  useEffect(() => {
    const { idVoie, idToponyme } = router.query;
    if (!isTileSourceLoaded) {
      return;
    }

    if (idVoie) {
      setBoundsItem(voie);
    } else if (idToponyme) {
      setBoundsItem(toponyme);
    }
  }, [router.query, voie, toponyme, setBoundsItem, isTileSourceLoaded]);

  useEffect(() => {
    const bounds = communeBounds;
    if (!isTileSourceLoaded) {
      return;
    }

    if (editingItem) {
      setBoundsItem(editingItem);
    } else if (!wasCenteredOnCommuneOnce) {
      setBounds(bounds);
      setWasCenteredOnCommuneOnce(true);
    }
  }, [
    communeBounds,
    isTileSourceLoaded,
    editingItem,
    setBoundsItem,
    wasCenteredOnCommuneOnce,
  ]);

  return bounds;
}

export default useBounds;
