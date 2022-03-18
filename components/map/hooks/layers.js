import {useContext, useMemo} from 'react'

import BalDataContext from '@/contexts/bal-data'

import {getVoiesLabelLayer, getVoieTraceLayer} from '@/components/map/layers/voies'
import {getNumerosPointLayer, getNumerosLabelLayer} from '@/components/map/layers/numeros'
import {cadastreLayers} from '@/components/map/layers/cadastre'

function useLayers(voie, sources, isCadastreDisplayed, style) {
  const {parcelles, commune} = useContext(BalDataContext)

  return useMemo(() => {
    const hasNumeros = sources.find(({name}) => name === 'positions')
    const hasVoies = sources.find(({name}) => name === 'voies')
    let layers = []

    if (isCadastreDisplayed) {
      layers = [...cadastreLayers(parcelles, commune.code)]
    }

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
  }, [voie, sources, isCadastreDisplayed, parcelles, style, commune.code])
}

export default useLayers
