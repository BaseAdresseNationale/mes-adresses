export const PANORAMAX_TILE_URL = `${process.env.NEXT_PUBLIC_PANORAMAX_API_ENDPOINT}/api/map/{z}/{x}/{y}.mvt`;

export const PANORAMAX_LAYERS_SOURCE = {
  SEQUENCES: "sequences",
  PICTURES: "pictures",
};

export const PANORAMAX_SEQUENCE_LAYER_ID = "sequence ID";
export const PANORAMAX_PICTURE_LAYER_ID = "picture ID";

export const panoramaxSequenceLayer = {
  id: PANORAMAX_SEQUENCE_LAYER_ID,
  "source-layer": PANORAMAX_LAYERS_SOURCE.SEQUENCES,
  interactive: false,
  type: "line",
  paint: {
    "line-color": "#0078ff",
    "line-width": 4,
  },
  layout: {
    "line-join": "round",
  },
};

export const panoramaxPictureLayer = {
  id: PANORAMAX_PICTURE_LAYER_ID,
  "source-layer": PANORAMAX_LAYERS_SOURCE.PICTURES,
  type: "circle",
  interactive: true,
  paint: {
    "circle-color": "#0078ff",
    "circle-opacity": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      1,
      0.7,
    ],
    "circle-radius": {
      stops: [
        [12, 0.8],
        [17, 6],
      ],
    },
    "circle-stroke-color": "#f8f4f0",
    "circle-stroke-width": {
      stops: [
        [12, 0.3],
        [17, 0.8],
      ],
    },
  },
};
