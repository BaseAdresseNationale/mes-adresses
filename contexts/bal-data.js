import React, {useState, useCallback, useEffect} from 'react'

import {getCommuneGeoJson, getNumeros, getVoies} from '../lib/bal-api'

const BalDataContext = React.createContext()

export function BalDataContextProvider({balId, codeCommune, idVoie, ...props}) {
  const [geojson, setGeojson] = useState()
  const [numeros, setNumeros] = useState()
  const [voies, setVoies] = useState()

  const reloadGeojson = useCallback(async () => {
    if (balId && codeCommune) {
      const geojson = await getCommuneGeoJson(balId, codeCommune)
      setGeojson(geojson)
    } else {
      setGeojson(null)
    }
  }, [balId, codeCommune])

  const reloadVoies = useCallback(async () => {
    if (balId && codeCommune) {
      const voies = await getVoies(balId, codeCommune)
      setVoies(voies)
    } else {
      setVoies(null)
    }
  }, [balId, codeCommune])

  const reloadNumeros = useCallback(async () => {
    if (idVoie) {
      const numeros = await getNumeros(idVoie)
      setNumeros(numeros)
    } else {
      setNumeros(null)
    }
  }, [idVoie])

  useEffect(() => {
    reloadGeojson()
  }, [reloadGeojson, voies, numeros])

  useEffect(() => {
    reloadNumeros()
  }, [reloadNumeros])

  useEffect(() => {
    reloadVoies()
  }, [reloadVoies])

  return (
    <BalDataContext.Provider
      value={{
        geojson,
        numeros,
        voies,
        reloadNumeros,
        reloadVoies
      }}
      {...props}
    />
  )
}

export default BalDataContext
