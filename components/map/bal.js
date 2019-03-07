import {useState, useEffect} from 'react'

import {communeNumerosToGeoJson, communeVoiesToGeoJson, voieNumerosToGeoJson} from '../../lib/geojson'

import {getNumerosPointLayer, getNumerosLabelLayer} from './bal/numeros'
import {getVoiesLabelLayer} from './bal/voies'

function getCommuneData(commune) {
  return [
    {
      name: 'numeros',
      data: communeNumerosToGeoJson(commune)
    },
    {
      name: 'voies',
      data: communeVoiesToGeoJson(commune)
    }
  ]
}

function getVoieData(voie) {
  return [
    {
      name: 'numeros',
      data: voieNumerosToGeoJson(voie)
    }
  ]
}

function useBal(bal, style) {
  const [sources, setSources] = useState([])
  const [layers, setLayers] = useState([])

  useEffect(() => {
    const newSources = []

    if (bal) {
      if (bal.voie) {
        newSources.push(...getVoieData(bal.voie))
      } else if (bal.commune) {
        newSources.push(...getCommuneData(bal.commune))
      }
    }

    setSources(newSources)
  }, [bal])

  useEffect(() => {
    const newLayers = []

    if (bal) {
      if (bal.voie) {
        newLayers.push(
          getNumerosLabelLayer(style)
        )
      } else if (bal.commune) {
        newLayers.push(
          getNumerosPointLayer(style),
          getVoiesLabelLayer(style)
        )
      }
    }

    setLayers(newLayers)
  }, [bal, style])

  return [sources, layers]
}

export default useBal
