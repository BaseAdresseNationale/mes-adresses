import React, {useState, useMemo, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'

import {getCommuneGeoJson, getNumeros, getVoies, getVoie, getBaseLocale} from '../lib/bal-api'

import {getPublishedBasesLocales} from '../lib/adresse-backend'

import TokenContext from './token'

const BalDataContext = React.createContext()

export const BalDataContextProvider = React.memo(({balId, codeCommune, idVoie, ...props}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, _setEditingId] = useState()
  const [geojson, setGeojson] = useState()
  const [numeros, setNumeros] = useState()
  const [voies, setVoies] = useState()
  const [voie, setVoie] = useState()
  const [baseLocale, setBaseLocal] = useState({})

  const {token} = useContext(TokenContext)

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

  const toponymes = useMemo(() => {
    if (numeros) {
      return null
    }

    if (voies) {
      return voies.filter(voie => voie.positions.length === 1)
    }
  }, [voies, numeros])

  const reloadNumeros = useCallback(async _idVoie => {
    const id = _idVoie || idVoie

    if (id) {
      const voie = await getVoie(id)
      const numeros = await getNumeros(id)
      setVoie(voie)
      setNumeros(numeros)
    } else {
      setVoie(null)
      setNumeros(null)
    }
  }, [idVoie])

  const reloadBaseLocale = useCallback(async () => {
    if (balId) {
      const baseLocale = await getBaseLocale(balId)
      const publishedBasesLocales = await getPublishedBasesLocales()
      baseLocale.published = Boolean(publishedBasesLocales.find(bal => bal._id === baseLocale._id))

      setBaseLocal(baseLocale)
    }
  }, [balId])

  const setEditingId = useCallback(editingId => {
    if (token) {
      _setEditingId(editingId)
      setIsEditing(Boolean(editingId))
    }
  }, [token])

  const editingItem = useMemo(() => {
    if (editingId) {
      const voie = voies.find(voie => voie._id === editingId)
      return voie || numeros.find(numero => numero._id === editingId)
    }
  }, [editingId, numeros, voies])

  useEffect(() => {
    reloadGeojson()
    setEditingId(null)
  }, [reloadGeojson, voies, numeros, setEditingId])

  useEffect(() => {
    setEditingId(null)
    reloadNumeros()
    reloadVoies()
    reloadBaseLocale()
  }, [setEditingId, reloadNumeros, reloadVoies, reloadBaseLocale])

  return (
    <BalDataContext.Provider
      value={{
        isEditing,
        setIsEditing,
        editingId,
        editingItem,
        geojson,
        baseLocale,
        voie,
        numeros,
        voies,
        toponymes,
        setEditingId,
        reloadNumeros,
        reloadVoies,
        reloadBaseLocale
      }}
      {...props}
    />
  )
})

BalDataContextProvider.propTypes = {
  balId: PropTypes.string,
  codeCommune: PropTypes.string,
  idVoie: PropTypes.string
}

BalDataContextProvider.defaultProps = {
  balId: null,
  codeCommune: null,
  idVoie: null
}

export default BalDataContext
