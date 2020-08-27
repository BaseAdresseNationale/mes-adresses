import {useMemo} from 'react'

import {getVoiesLabelLayer, getVoieLineLayer} from '../layers/voies'
import {getNumerosPointLayer, getNumerosLabelLayer} from '../layers/numeros'

function useLayers(voie, style) {
  return useMemo(() => {
    const layers = [
      getNumerosPointLayer(style),
      getNumerosLabelLayer()
    ]

    layers.push(
      voie ? getVoieLineLayer(style) : getVoiesLabelLayer(style)
    )

    return layers
  }, [voie, style])
}

export default useLayers
