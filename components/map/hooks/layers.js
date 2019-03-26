import {useMemo} from 'react'

import {getVoiesLabelLayer, getToponymesLabelLayer} from '../layers/voies'
import {getNumerosPointLayer} from '../layers/numeros'

function useLayers(voie, style) {
  return useMemo(() => {
    const layers = [
      getNumerosPointLayer(style)
    ]

    if (!voie) {
      layers.push(
        getVoiesLabelLayer(style),
        getToponymesLabelLayer(style)
      )
    }

    return layers
  }, [voie, style])
}

export default useLayers
