import {useMemo} from 'react'

import {getVoiesLabelLayer, getVoieTraceLayer} from '../layers/voies'
import {getNumerosPointLayer, getNumerosLabelLayer} from '../layers/numeros'
import {cadastreLayers} from '../layers/cadastre'

function useLayers(voie, sources, showCadastre, style) {
  return useMemo(() => {
    const hasNumeros = sources.find(({name}) => name === 'positions')
    const hasVoies = sources.find(({name}) => name === 'voies')
    let layers = []

    if (hasVoies) {
      layers.push(getVoieTraceLayer(style))
    }

    if (showCadastre) {
      layers = [...layers, ...cadastreLayers]
    }

    if (hasNumeros) {
      layers.push(
        getNumerosPointLayer(style),
        getNumerosLabelLayer()
      )
    }

    if (!voie && hasVoies) {
      layers.push(
        getVoiesLabelLayer(style)
      )
    }

    return layers
  }, [voie, sources, showCadastre, style])
}

export default useLayers
