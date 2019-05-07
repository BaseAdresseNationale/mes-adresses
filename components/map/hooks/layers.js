import {useMemo} from 'react'

import {getVoiesLabelLayer} from '../layers/voies'
import {getNumerosPointLayer, getNumerosLabelLayer} from '../layers/numeros'

function useLayers(voie, style) {
  return useMemo(() => {
    const layers = [
      getNumerosPointLayer(style),
      getNumerosLabelLayer()
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
