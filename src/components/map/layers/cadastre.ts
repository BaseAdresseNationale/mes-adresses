import { SignalementDiff } from "@/lib/utils/signalement";

export const SOURCE = "cadastre";

export const SOURCE_LAYER = {
  BATIMENTS: "batiments",
  PARCELLES: "parcelles",
  SECTIONS: "sections",
};

export const LAYER = {
  BATIMENTS_FILL: "batiments-fill",
  BATIMENTS_LINE: "batiments-line",
  PARCELLES: "parcelles",
  PARCELLES_FILL: "parcelles-fill",
  PARCELLES_SELECTED: "parcelles-selected",
  PARCELLE_HIGHLIGHTED: "parcelle-highlighted",
  PARCELLE_HIGHLIGHTED_DIFF_MODE: "parcelle-highlighted-diff-mode",
  SECTIONS: "sections",
  CODE_SECTION: "code-section",
  CODE_PARCELLES: "code-parcelles",
};

const signalementColors = {
  [SignalementDiff.NEW]: "rgba(218, 244, 246, 1)",
  [SignalementDiff.DELETED]: "rgba(244, 228, 219, 1)",
  [SignalementDiff.UNCHANGED]: "rgba(64, 101, 246, 1)",
};

export const cadastreLayers = [
  {
    id: LAYER.BATIMENTS_FILL,
    type: "fill",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.BATIMENTS,
    minzoom: 16,
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-opacity": 0.3,
    },
  },
  {
    id: LAYER.BATIMENTS_LINE,
    type: "line",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.BATIMENTS,
    minzoom: 16,
    maxzoom: 22,
    layout: {
      visibility: "none",
    },
    paint: {
      "line-opacity": 1,
      "line-color": "rgba(0, 0, 0, 1)",
    },
  },
  {
    id: LAYER.PARCELLES,
    type: "line",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELLES,
    minzoom: 16,
    maxzoom: 24,
    layout: {
      visibility: "none",
      "line-cap": "butt",
    },
    paint: {
      "line-color": "#0053b3",
      "line-opacity": 0.9,
      "line-width": {
        stops: [
          [16, 1],
          [17, 2],
        ],
      },
    },
  },
  {
    id: LAYER.PARCELLES_FILL,
    type: "fill",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELLES,
    layout: {
      visibility: "none",
    },
    paint: {
      "fill-color": "rgba(129, 123, 0, 1)",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.7,
        0.1,
      ],
    },
  },
  {
    id: LAYER.PARCELLES_SELECTED,
    type: "fill",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELLES,
    layout: {
      visibility: "none",
    },
    filter: ["==", "id", ""],
    paint: {
      "fill-color": "#0053b3",
      "fill-opacity": 0.2,
    },
  },
  {
    id: LAYER.PARCELLE_HIGHLIGHTED,
    type: "fill",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELLES,
    layout: {
      visibility: "none",
    },
    filter: ["==", "id", ""],
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "rgba(209, 67, 67, 1)",
        "rgba(1, 129, 0, 1)",
      ],
      "fill-opacity": 0.7,
    },
  },
  {
    id: LAYER.PARCELLE_HIGHLIGHTED_DIFF_MODE,
    type: "fill",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELLES,
    layout: {
      visibility: "none",
    },
    filter: ["==", "id", ""],
    paint: {
      "fill-color": [
        "case",
        ["==", ["feature-state", "diff"], SignalementDiff.DELETED],
        signalementColors[SignalementDiff.DELETED],
        ["==", ["feature-state", "diff"], SignalementDiff.NEW],
        signalementColors[SignalementDiff.NEW],
        signalementColors[SignalementDiff.UNCHANGED],
      ],
      "fill-opacity": 0.7,
    },
  },
  {
    id: LAYER.SECTIONS,
    type: "line",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.SECTIONS,
    minzoom: 12,
    maxzoom: 24,
    layout: {
      visibility: "none",
    },
    paint: {
      "line-color": "rgba(116, 134, 241, 1)",
      "line-opacity": 0.9,
      "line-width": 2,
    },
  },
  {
    id: LAYER.CODE_SECTION,
    type: "symbol",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.SECTIONS,
    minzoom: 12.5,
    maxzoom: 16,
    layout: {
      visibility: "none",
      "text-field": "{code}",
      "text-font": ["Open Sans Regular"],
    },
    paint: {
      "text-halo-color": "rgba(255, 246, 241, 1)",
      "text-halo-width": 1.5,
    },
  },
  {
    id: LAYER.CODE_PARCELLES,
    type: "symbol",
    source: SOURCE,
    "source-layer": SOURCE_LAYER.PARCELLES,
    minzoom: 16,
    filter: ["all"],
    layout: {
      visibility: "none",
      "text-field": [
        "concat",
        ["get", "section"],
        ["slice", ["concat", "000", ["to-string", ["get", "numero"]]], -4],
      ],
      "text-font": ["Open Sans Regular"],
      "text-allow-overlap": false,
      "text-size": 16,
    },
    paint: {
      "text-halo-color": "#fff6f1",
      "text-halo-width": 1.5,
      "text-translate-anchor": "map",
    },
  },
];
