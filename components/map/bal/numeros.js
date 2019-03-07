export function getNumerosPointLayer(style) {
  const layer = {
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
          [12, 0.8],
          [17, 4]
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
  }

  if (style === 'ortho') {
    layer.paint['circle-stroke-color'] = '#ffffff'
  }

  return layer
}

export function getNumerosLabelLayer() {
  const layer = {
    id: 'numeros-label',
    type: 'symbol',
    source: 'numeros',
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#0081d5',
      'text-halo-width': {
        stops: [
          [12, 1.5],
          [18, 2]
        ]
      }
    },
    layout: {
      'text-font': ['Noto Sans Regular'],
      'text-field': '{numeroComplet}',
      'text-ignore-placement': true
    }
  }

  return layer
}
