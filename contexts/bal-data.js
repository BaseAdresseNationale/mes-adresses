import React, {useState, useCallback, useEffect, useContext} from 'react'

import {getCommuneGeoJson, getNumeros, getVoies} from '../lib/bal-api'

import TokenContext from './token'

const BalDataContext = React.createContext()

export function BalDataContextProvider({balId, codeCommune, idVoie, ...props}) {
  const [editingId, _setEditingId] = useState()
  const [geojson, setGeojson] = useState()
  const [numeros, setNumeros] = useState()
  const [voies, setVoies] = useState()

  const token = useContext(TokenContext)

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

  const setEditingId = useCallback(editingId => {
    if (token) {
      _setEditingId(editingId)
    }
  }, [token])

  useEffect(() => {
    reloadGeojson()
    setEditingId(null)
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
        editingId,
        geojson,
        numeros,
        voies,
        setEditingId,
        reloadNumeros,
        reloadVoies
      }}
      {...props}
    />
  )
}

export default BalDataContext
