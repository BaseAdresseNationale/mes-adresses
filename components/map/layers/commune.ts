export const LAYER_COMMUNE_ID = "layer-commune";
export const SOURCE_COMMUNE_ID = "source-commune";

export const LAYER_COMMUNE = {
  id: LAYER_COMMUNE_ID,
  type: "fill",
  paint: {
    "fill-color": "#3288bd",
    "fill-opacity": [
      "interpolate",
      ["exponential", 0.5],
      ["zoom"],
      13,
      0.8,
      14,
      0,
    ],
  },
};
