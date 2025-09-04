import { LAYERS_SOURCE } from "@/components/map/layers/tiles";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { MapGeoJSONFeature } from "maplibre-gl";
import { NextRouter } from "next/router";
import type { Map as MaplibreMap, FilterSpecification } from "maplibre-gl";

export function handleSelectToponyme(
  feature: MapGeoJSONFeature,
  router: NextRouter,
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
  router: NextRouter,
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
