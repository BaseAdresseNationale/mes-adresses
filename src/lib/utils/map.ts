import { LAYERS_SOURCE, mapLayersIds } from "@/components/map/layers/tiles";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { MapGeoJSONFeature } from "maplibre-gl";
import { useRouter } from "next/navigation";
import maplibregl from "maplibre-gl";
import type { Map as MaplibreMap, FilterSpecification } from "maplibre-gl";
import { Voie } from "../openapi-api-bal";
import bbox from "@turf/bbox";

export function handleSelectToponyme(
  feature: MapGeoJSONFeature,
  router: ReturnType<typeof useRouter>,
  balId: string
) {
  const idToponyme =
    (feature.sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS &&
      feature.properties.idToponyme) ||
    (feature.sourceLayer === LAYERS_SOURCE.TOPONYME_POINTS &&
      feature.properties.id);

  if (idToponyme) {
    router.push(`/bal/${balId}/${TabsEnum.TOPONYMES}/${idToponyme}/numeros`);
  }
}

export function handleSelectVoie(
  feature: MapGeoJSONFeature,
  router: ReturnType<typeof useRouter>,
  balId: string
) {
  const idVoie =
    (feature.sourceLayer === LAYERS_SOURCE.NUMEROS_POINTS &&
      feature.properties.idVoie) ||
    ((feature.sourceLayer === LAYERS_SOURCE.VOIES_POINTS ||
      feature.sourceLayer === LAYERS_SOURCE.VOIES_LINES_STRINGS) &&
      feature.properties.id);

  if (idVoie) {
    router.push(`/bal/${balId}/${TabsEnum.VOIES}/${idVoie}/numeros`);
  }
}

export function setMapFilter(
  map: MaplibreMap,
  layerId: string,
  filter: FilterSpecification
) {
  if (map.getLayer(layerId)) {
    map.setFilter(layerId, filter);
  }
}

export const resetMapFilter = (map: MaplibreMap) => {
  for (const layerId of mapLayersIds) {
    if (map.getLayer(layerId)) {
      map.setFilter(layerId, null);
    }
  }
};

export const bboxForVoie = (item: Voie, map: MaplibreMap) => {
  if (map && item && item.trace) {
    return bbox(JSON.parse(JSON.stringify(item.trace)));
  } else if (map && item && item.bbox) {
    return item.bbox;
  }
};

export function getImageBase64(
  map: MaplibreMap,
  type?: string,
  quality?: number
): Promise<string> {
  return new Promise((resolve) => {
    map.once("render", () =>
      resolve((map.getCanvas() as HTMLCanvasElement).toDataURL(type, quality))
    );
    map.setBearing(map.getBearing());
  });
}

// On créer un fause map avec la library pour tester si la source est bonne
export async function validateSourceWithTempMap({
  id: sourceId,
  url,
}): Promise<boolean> {
  return new Promise((resolve) => {
    const tempDiv = document.createElement("div");
    tempDiv.style.width = "1px";
    tempDiv.style.height = "1px";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    const tempMap = new maplibregl.Map({
      container: tempDiv,
      style: {
        version: 8,
        sources: {},
        layers: [],
      },
      center: [0, 0],
      zoom: 1,
      interactive: false,
    });

    let done = false;

    const finish = (isValid: boolean) => {
      if (done) return;
      done = true;
      tempMap.remove();
      tempDiv.remove();
      resolve(isValid);
    };

    tempMap.on("load", () => {
      tempMap.addSource(sourceId, {
        type: "raster",
        tiles: [url],
      });

      tempMap.addLayer({
        id: sourceId,
        type: "raster",
        source: sourceId,
      });
    });

    tempMap.on("data", (e) => {
      if ((e as any).sourceId === sourceId && (e as any).isSourceLoaded) {
        finish(true);
      }
    });

    tempMap.on("error", (e) => {
      if (e.error && (e as any).sourceId === sourceId) {
        console.error("Error loading source", e.error);
        finish(false);
      }
    });

    setTimeout(() => finish(false), 4000);
  });
}
