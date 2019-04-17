export function getNumerosPointLayer(style) {
  const layer = {
    id: 'numeros-point',
    type: 'circle',
    source: 'positions',
    paint: {
      'circle-color': {
        type: 'identity',
        property: 'color'
      },
      'circle-opacity': {
        type: 'identity',
        property: 'opacity'
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

export function getHoveredLayer(style) {
  const {paint} = getNumerosPointLayer(style)
  paint['circle-radius'] = {
    stops: [
      [12, 1],
      [17, 6]
    ]
  }
  const layer = {
    id: 'numeros-hovered',
    type: 'circle',
    source: 'hovered',
    paint
  }

  return layer
}
