export const LAYERS_SOURCE = {
  NUMEROS_POINTS: 'numeros-points',
  VOIES_POINTS: 'voies-points',
  VOIES_LINES_STRINGS: 'voies-linestrings'
}

const ZOOM = {
  NUMEROS_ZOOM: {
    minZoom: 13,
    maxZoom: 17
  },
  VOIE_ZOOM: {
    minZoom: 13,
    maxZoom: 17
  },
  TRACE_ZOOM: {
    minZoom: 13,
  }
}

export const VOIE_LABEL = 'voie-label'
export const VOIE_TRACE_LINE = 'voie-trace-line'
export const NUMEROS_POINT = 'numeros-point'
export const NUMEROS_LABEL = 'numeros-label'

export const tilesLayers = {
  VOIE_LABEL: {
    id: VOIE_LABEL,
    'source-layer': LAYERS_SOURCE.VOIES_POINTS,
    interactive: true,
    type: 'symbol',
    maxzoom: ZOOM.VOIE_ZOOM.maxZoom,
    paint: {
      'text-color': [
        'case',
        [
          'boolean',
          [
            'feature-state',
            'hover'
          ],
          false
        ],
        ['get', 'color'],
        '#000'
      ],
      'text-halo-color': '#f8f4f0',
      'text-halo-blur': 0.5,
      'text-halo-width': {
        stops: [
          [12, 1.5],
          [18, 2]
        ]
      }
    },
    layout: {
      'text-field': ['get', 'nom'],
      'text-anchor': 'top',
      'text-size': {
        base: 1,
        stops: [
          [13, 13],
          [15, 14]
        ]
      },
      'text-font': ['Open Sans Regular']
    }
  },
  VOIE_TRACE_LINE: {
    id: VOIE_TRACE_LINE,
    'source-layer': LAYERS_SOURCE.VOIES_LINES_STRINGS,
    minzoom: ZOOM.TRACE_ZOOM.minZoom,
    type: 'line',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 4,
      'line-opacity': [
        'case',
        [
          'boolean',
          [
            'feature-state',
            'hover'
          ],
          false
        ],
        1,
        0.7
      ]
    },
    layout: {
      'line-join': 'round'
    }
  },
  NUMEROS_POINT: {
    id: NUMEROS_POINT,
    'source-layer': LAYERS_SOURCE.NUMEROS_POINTS,
    type: 'circle',
    interactive: true,
    minzoom: ZOOM.NUMEROS_ZOOM.minZoom,
    maxzoom: ZOOM.NUMEROS_ZOOM.maxZoom,
    paint: {
      'circle-color': {
        type: 'identity',
        property: 'color'
      },
      'circle-opacity': [
        'case',
        [
          'boolean',
          [
            'feature-state',
            'hover'
          ],
          false
        ],
        1,
        0.7
      ],
      'circle-radius': {
        stops: [
          [12, 0.8],
          [17, 6]
        ]
      },
      'circle-stroke-color': '#f8f4f0',
      'circle-stroke-width': {
        stops: [
          [12, 0.3],
          [17, 0.8]
        ]
      }
    }
  },
  NUMEROS_LABEL: {
    id: NUMEROS_LABEL,
    'source-layer': LAYERS_SOURCE.NUMEROS_POINTS,
    type: 'symbol',
    interactive: true,
    minzoom: ZOOM.NUMEROS_ZOOM.maxZoom,
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': {
        type: 'identity',
        property: 'color'
      },
      'text-halo-width': {
        stops: [
          [12, 1.5],
          [18, 2]
        ]
      },
      'text-opacity': [
        'case',
        [
          'boolean',
          [
            'feature-state',
            'hover'
          ],
          false
        ],
        1,
        0.7
      ],
    },
    layout: {
      'text-font': ['Open Sans Regular'],
      'text-field': [
        'case',
        ['has', 'suffixe'],
        [
          'format',
          ['get', 'numero'],
          {},
          ' ',
          {},
          ['get', 'suffixe'],
          {}
        ],
        ['get', 'numero']
      ],
      'text-ignore-placement': true
    }
  }
}
