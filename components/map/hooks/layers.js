import {useContext, useMemo} from 'react'

import BalDataContext from '../../../contexts/bal-data'

import {getVoiesLabelLayer, getVoieTraceLayer} from '../layers/voies'
import {getNumerosPointLayer, getNumerosLabelLayer} from '../layers/numeros'
import {cadastreLayers} from '../layers/cadastre'

function useLayers(voie, sources, showCadastre, style) {
  const {parcelles} = useContext(BalDataContext)

  return useMemo(() => {
    const hasNumeros = sources.find(({name}) => name === 'positions')
    const hasVoies = sources.find(({name}) => name === 'voies')
    let layers = []

    if (showCadastre) {
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
  }, [voie, sources, showCadastre, parcelles, style])
}

export default useLayers
