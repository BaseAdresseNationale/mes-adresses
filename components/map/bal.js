import {useState, useEffect} from 'react'

import {communeNumerosToGeoJson, communeVoiesToGeoJson, voieNumerosToGeoJson} from '../../lib/geojson'

function getCommuneData(commune) {
  return {
    sources: [
      {
        name: 'numeros',
        data: communeNumerosToGeoJson(commune)
      },
      {
        name: 'voies',
        data: communeVoiesToGeoJson(commune)
      }
    ],
    layers: [
      {
        id: 'numeros-point',
        type: 'circle',
        source: 'numeros',
        paint: {
          'circle-color': {
            type: 'identity',
            property: 'color'
          },
          'circle-radius': {
            stops: [
              [12, 0.5],
              [17, 4]
            ]
          }
        }
      },
      {
        id: 'voies',
        type: 'symbol',
        source: 'voies',
        paint: {
          'text-halo-color': '#f8f4f0',
          'text-halo-blur': 0.5,
          'text-halo-width': 2
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
              [
                14,
                13
              ],
              [
                15,
                14
              ]
            ]
          },
          'text-font': ['Noto Sans Regular']
        }
      }
    ]
  }
}

function getVoieData(voie) {
  return {
    sources: [
      {
        name: 'numeros',
        data: voieNumerosToGeoJson(voie)
      }
    ],
    layers: [
      {
        id: 'numeros',
        type: 'symbol',
        source: 'numeros',
        minzoom: 10,
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#0081d5',
          'text-halo-width': 1.7
        },
        layout: {
          'text-font': ['Noto Sans Regular'],
          'text-field': '{numeroComplet}',
          'text-ignore-placement': true
        }
      }
    ]
  }
}

function useBal(bal) {
  const [sources, setSources] = useState([])
  const [layers, setLayers] = useState([])

  useEffect(() => {
    if (!bal) {
      return
    }

    let newSources = []
    let newLayers = []

    if (bal.voie) {
      ({sources: newSources, layers: newLayers} = getVoieData(bal.voie))
    } else if (bal.commune) {
      ({sources: newSources, layers: newLayers} = getCommuneData(bal.commune))
    }

    setSources(newSources)
    setLayers(newLayers)
  }, [bal])

  return [sources, layers]
}

export default useBal
