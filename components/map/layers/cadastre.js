export const cadastreLayers = (parcelles, codeCommune) => [{
  id: 'batiments-fill',
  type: 'fill',
  source: 'cadastre',
  'source-layer': 'batiments',
  minzoom: 16,
  paint: {
    'fill-opacity': 0.3
  }
},
{
  id: 'batiments-line',
  type: 'line',
  source: 'cadastre',
  'source-layer': 'batiments',
  minzoom: 16,
  maxzoom: 22,
  paint: {
    'line-opacity': 1,
    'line-color': 'rgba(0, 0, 0, 1)'
  }
},
{
  id: 'parcelles',
  type: 'line',
  source: 'cadastre',
  'source-layer': 'parcelles',
  filter: ['match', ['get', 'commune'], codeCommune, true, false],
  minzoom: 16,
  maxzoom: 24,
  layout: {
    'line-cap': 'butt'
  },
  paint: {
    'line-color': '#0053b3',
    'line-opacity': 0.9,
    'line-width': {
      stops: [
        [
          16,
          1
        ],
        [
          17,
          2
        ]
      ]
    }
  }
},
{
  id: 'parcelles-fill',
  type: 'fill',
  source: 'cadastre',
  'source-layer': 'parcelles',
  filter: ['match', ['get', 'commune'], codeCommune, true, false],
  paint: {
    'fill-color': 'rgba(129, 123, 0, 1)',
    'fill-opacity': [
      'case',
      [
        'boolean',
        [
          'feature-state',
          'hover'
        ],
        false
      ],
      0.7,
      0.1
    ]
  }
},
{
  id: 'parcelles-selected',
  type: 'fill',
  source: 'cadastre',
  'source-layer': 'parcelles',
  filter: ['any', ...parcelles.map(id => ['==', ['get', 'id'], id])],
  paint: {
    'fill-color': '#0053b3',
    'fill-opacity': 0.2
  }
},
{
  id: 'parcelle-highlighted',
  type: 'fill',
  source: 'cadastre',
  'source-layer': 'parcelles',
  filter: [
    '==',
    'id',
    ''
  ],
  paint: {
    'fill-color': [
      'case',
      [
        'boolean',
        [
          'feature-state',
          'hover'
        ],
        false
      ],
      'rgba(209, 67, 67, 1)',
      'rgba(1, 129, 0, 1)'
    ],
    'fill-opacity': 0.7
  }
},
{
  id: 'sections',
  type: 'line',
  source: 'cadastre',
  'source-layer': 'sections',
  minzoom: 12,
  maxzoom: 24,
  paint: {
    'line-color': 'rgba(116, 134, 241, 1)',
    'line-opacity': 0.9,
    'line-width': 2
  }
},
{
  id: 'code-section',
  type: 'symbol',
  source: 'cadastre',
  'source-layer': 'sections',
  minzoom: 12.5,
  maxzoom: 16,
  layout: {
    'text-field': '{code}',
    'text-font': ['Open Sans Regular']
  },
  paint: {
    'text-halo-color': 'rgba(255, 246, 241, 1)',
    'text-halo-width': 1.5
  }
},
{
  id: 'code-parcelles',
  type: 'symbol',
  source: 'cadastre',
  'source-layer': 'parcelles',
  minzoom: 16,
  filter: [
    'all'
  ],
  layout: {
    'text-field': '{numero}',
    'text-font': ['Open Sans Regular'],
    'text-allow-overlap': false,
    'text-size': 16
  },
  paint: {
    'text-halo-color': '#fff6f1',
    'text-halo-width': 1.5,
    'text-translate-anchor': 'map'
  }
}]
