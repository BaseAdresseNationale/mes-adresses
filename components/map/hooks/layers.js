import {useMemo} from 'react'

import {getVoiesLabelLayer} from '../layers/voies'
import {getNumerosPointLayer, getHoveredLayer} from '../layers/numeros'

function useLayers(voie, style) {
  return useMemo(() => {
    const layers = [
      getNumerosPointLayer(style),
      getHoveredLayer(style)
    ]

    if (!voie) {
      layers.push(
        getVoiesLabelLayer(style)
      )
    }

    return layers
  }, [voie, style])
}

export default useLayers
