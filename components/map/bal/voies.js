export function getVoiesLabelLayer(style) {
  const layer = {
    id: 'voies-label',
    interactive: true,
    type: 'symbol',
    source: 'voies',
    paint: {
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
      'text-field': [
        'format',

        ['get', 'nomVoie'],
        {},

        [
          'case',
          ['==', ['get', 'numerosCount'], 0],
          '\nToponyme',
          ['==', ['get', 'numerosCount'], '1'],
          '\n1 numéro',
          ['concat', '\n', ['get', 'numerosCount'], ' numéros']
        ],
        {'font-scale': 0.9}
      ],
      'text-anchor': 'top',
      'text-size': {
        base: 1,
        stops: [
          [13, 13],
          [15, 14]
        ]
      },
      'text-font': ['Noto Sans Regular']
    }
  }

  if (style === 'ortho') {
    layer.paint['text-halo-color'] = '#ffffff'
  }

  return layer
}
