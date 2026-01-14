"use client";

import { useContext, useState, useEffect, useCallback } from "react";
import bbox from "@turf/bbox";
import type { Map } from "maplibre-gl";
import BalDataContext from "@/contexts/bal-data";
import { Toponyme, Voie } from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";
import { useSearchParams } from "next/navigation";

function useBounds(
  map: Map,
  commune: CommuneType,
  voie: Voie,
  toponyme: Toponyme
) {
  const searchParams = useSearchParams();
  const [bounds, setBounds] = useState<number[]>(commune.bbox);
  const { editingItem } = useContext(BalDataContext);

  const [wasCenteredOnCommuneOnce, setWasCenteredOnCommuneOnce] =
    useState(false);

  const bboxForItem = useCallback(
    (item) => {
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
      setBounds(commune.bbox);
      setWasCenteredOnCommuneOnce(true);
    }
  }, [editingItem, wasCenteredOnCommuneOnce, map, bboxForItem, commune.bbox]);

  useEffect(() => {
    const idVoie = searchParams.get("idVoie");
    const idToponyme = searchParams.get("idToponyme");
    if (!map) {
      return;
    }

    if (idVoie) {
      setBounds(bboxForItem(voie));
    } else if (idToponyme) {
      setBounds(bboxForItem(toponyme));
    }
  }, [searchParams, voie, toponyme, map, bboxForItem]);

  return bounds;
}

export default useBounds;
