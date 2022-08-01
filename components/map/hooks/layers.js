import {useMemo} from 'react'

import {getVoiesLabelLayer, getVoieTraceLayer} from '@/components/map/layers/voies'
import {getNumerosPointLayer, getNumerosLabelLayer} from '@/components/map/layers/numeros'
import {cadastreLayers} from '@/components/map/layers/cadastre'

function useLayers(voie, sources, isCadastreDisplayed, style) {
  return useMemo(() => {
    const hasNumeros = sources.find(({name}) => name === 'positions')
    const hasVoies = sources.find(({name}) => name === 'voies')
    const layers = [...cadastreLayers]

    if (hasVoies) {
      layers.push(getVoieTraceLayer(style))
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
  }, [voie, sources, style])
}

export default useLayers
