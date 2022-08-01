export const voiesLayers = [{
  id: 'voie-label',
  interactive: true,
  type: 'symbol',
  source: 'voies',
  maxzoom: 17,
  paint: {
    'text-color': [
      'case',
      ['==', ['get', 'opacity'], 1],
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
    'text-field': ['get', 'nomVoie'],
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
}, {
  id: 'voie-trace-line',
  type: 'line',
  source: 'voie-trace',
  paint: {
    'line-color': ['get', 'color'],
    'line-width': 4
  },
  layout: {
    'line-join': 'round'
  }
}]
