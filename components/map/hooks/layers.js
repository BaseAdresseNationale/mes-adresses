import {useContext, useMemo} from 'react'

import BalDataContext from '../../../contexts/bal-data'

import {getVoiesLabelLayer, getVoieTraceLayer} from '../layers/voies'
import {getNumerosPointLayer, getNumerosLabelLayer} from '../layers/numeros'
import {cadastreLayers} from '../layers/cadastre'

function useLayers(voie, sources, isCadastreDisplayed, style) {
  const {parcelles} = useContext(BalDataContext)

  return useMemo(() => {
    const hasNumeros = sources.find(({name}) => name === 'positions')
    const hasVoies = sources.find(({name}) => name === 'voies')
    let layers = []

    if (isCadastreDisplayed) {
      layers = [...cadastreLayers(parcelles)]
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
  }, [voie, sources, isCadastreDisplayed, parcelles, style])
}

export default useLayers
