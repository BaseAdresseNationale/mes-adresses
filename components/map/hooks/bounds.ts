import { useMemo, useContext, useState, useEffect, useCallback } from "react";
import bbox from "@turf/bbox";
import type { LngLatBoundsLike, Map, VectorTileSource } from "maplibre-gl";

import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";
import { useRouter } from "next/router";
import { CommuneType } from "@/types/commune";
import { Toponyme, Voie } from "@/lib/openapi";
import { ViewState } from "react-map-gl";

function useBounds(
  map: Map,
  commune: CommuneType,
  voie: Voie,
  toponyme: Toponyme
) {
  const router = useRouter();

  const communeBbox: number[] = useMemo(
    () => (commune.contour ? bbox(commune.contour) : null),
    [commune.contour]
  );

  const [bounds, setBounds] = useState<number[]>(communeBbox);

  const { editingItem } = useContext(BalDataContext);

  const [wasCenteredOnCommuneOnce, setWasCenteredOnCommuneOnce] =
    useState(false);

  const bboxForItem = useCallback(
    (item) => {
      console.log(item);
      if (map && item && item.trace) {
        return bbox(item.trace);
      } else if (map && item && item.bbox) {
        return item.bbox;
      }
    },
    [map]
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    if (editingItem) {
      setBounds(bboxForItem(editingItem));
    } else if (!wasCenteredOnCommuneOnce) {
      setBounds(communeBbox);
      setWasCenteredOnCommuneOnce(true);
    }
  }, [editingItem, wasCenteredOnCommuneOnce, map, bboxForItem, communeBbox]);

  useEffect(() => {
    const { idVoie, idToponyme } = router.query;
    if (!map) {
      return;
    }

    if (idVoie) {
      setBounds(bboxForItem(voie));
    } else if (idToponyme) {
      setBounds(bboxForItem(toponyme));
    }
  }, [router.query, voie, toponyme, map, bboxForItem]);

  return bounds;
}

export default useBounds;
