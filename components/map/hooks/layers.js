import {useMemo} from 'react'

import {getVoiesLabelLayer, getVoieTraceLayer} from '../layers/voies'
import {getNumerosPointLayer, getNumerosLabelLayer} from '../layers/numeros'

function useLayers(voie, sources, style, isComplementEnabled) {
  return useMemo(() => {
    const hasNumeros = sources.find(({name}) => name === 'positions')
    const hasVoies = sources.find(({name}) => name === 'voies')

    const layers = hasVoies ? [
      getVoieTraceLayer(style)
    ] : []

    if (hasNumeros) {
      layers.push(
        getNumerosPointLayer(style),
        getNumerosLabelLayer()
      )
    }

    if (!voie && hasVoies) {
      layers.push(
        getVoiesLabelLayer(style, isComplementEnabled)
      )
    }

    return layers
  }, [voie, sources, style, isComplementEnabled])
}

export default useLayers
