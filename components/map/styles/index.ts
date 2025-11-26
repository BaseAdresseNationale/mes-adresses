import { fromJS } from "immutable";

import orthoStyle from "@/components/map/styles/ortho.json";
import vectorStyle from "@/components/map/styles/vector.json";
import planIGNStyle from "@/components/map/styles/plan-ign.json";

export const ortho = fromJS(orthoStyle);
export const vector = fromJS(vectorStyle);
export const planIGN = fromJS(planIGNStyle);

export const getStyleDynamically = ({ name, url }) => {
  return fromJS({
    version: 8,
    glyphs:
      "https://openmaptiles.geo.data.gouv.fr/fonts/{fontstack}/{range}.pbf",
    sources: {
      [name]: {
        type: "raster",
        tiles: [url],
      },
      ...otherSources,
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: name,
      },
      ...layersDecoupageAdministratif,
    ],
  });
};

const otherSources = {
  cadastre: {
    type: "vector",
    url: "https://openmaptiles.geo.data.gouv.fr/data/cadastre.json",
  },
  "decoupage-administratif": {
    type: "vector",
    url: "https://openmaptiles.geo.data.gouv.fr/data/decoupage-administratif.json",
  },
};

const layersDecoupageAdministratif = [
  {
    id: "communes",
    type: "line",
    source: "decoupage-administratif",
    "source-layer": "communes",
    minzoom: 2,
    layout: {
      "line-join": "round",
      visibility: "visible",
    },
    paint: {
      "line-color": "#ffffff",
      "line-dasharray": [3, 1, 1, 1],
      "line-width": {
        base: 1.4,
        stops: [
          [4, 0.4],
          [5, 1],
          [12, 3],
        ],
      },
    },
  },
  {
    id: "departements",
    type: "line",
    source: "decoupage-administratif",
    "source-layer": "departements",
    maxzoom: 9,
    layout: {
      "line-join": "round",
      visibility: "visible",
    },
    paint: {
      "line-color": "hsl(248, 7%, 66%)",
      "line-dasharray": [3, 1, 1, 1],
      "line-width": {
        base: 1.4,
        stops: [
          [0, 0.6],
          [4, 1.4],
          [5, 2],
          [12, 8],
        ],
      },
    },
  },
  {
    id: "regions",
    type: "line",
    source: "decoupage-administratif",
    "source-layer": "regions",
    maxzoom: 5,
    layout: {
      "line-join": "round",
      visibility: "visible",
    },
    paint: {
      "line-color": "hsl(248, 7%, 70%)",
      "line-dasharray": [3, 1, 1, 1],
      "line-width": {
        base: 1.6,
        stops: [
          [0, 0.6],
          [4, 1.4],
          [5, 2],
          [12, 8],
        ],
      },
    },
  },
];
