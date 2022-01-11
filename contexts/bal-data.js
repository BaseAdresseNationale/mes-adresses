import React, {useState, useMemo, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {toaster} from 'evergreen-ui'

import {getHabilitation, getParcelles, getCommuneGeoJson, getNumeros, getVoies, getVoie, getBaseLocale, getToponymes, getNumerosToponyme, getToponyme, certifyBAL} from '../lib/bal-api'

import TokenContext from './token'

const BalDataContext = React.createContext()

export const BalDataContextProvider = React.memo(({balId, codeCommune, idVoie, idToponyme, ...props}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, _setEditingId] = useState()
  const [parcelles, setParcelles] = useState([])
  const [geojson, setGeojson] = useState()
  const [numeros, setNumeros] = useState()
  const [voies, setVoies] = useState()
  const [toponymes, setToponymes] = useState()
  const [voie, setVoie] = useState(null)
  const [toponyme, setToponyme] = useState()
  const [baseLocale, setBaseLocale] = useState(null)
  const [habilitation, setHabilitation] = useState(null)
  const [isRefrehSyncStat, setIsRefrehSyncStat] = useState(false)

  const {token} = useContext(TokenContext)

  const reloadHabilitation = useCallback(async () => {
    if (balId && token) {
      try {
        const habilitation = await getHabilitation(token, balId)
        setHabilitation(habilitation)
      } catch {
        setHabilitation(null)
      }
    }
  }, [balId, token])

  const reloadParcelles = useCallback(async () => {
    if (balId && codeCommune) {
      const parcelles = await getParcelles(balId, codeCommune)
      setParcelles(parcelles)
    } else {
      setParcelles([])
    }
  }, [balId, codeCommune])

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

  const reloadToponymes = useCallback(async () => {
    if (balId && codeCommune) {
      const toponymes = await getToponymes(balId, codeCommune)
      setToponymes(toponymes)
    } else {
      setToponymes(null)
    }
  }, [balId, codeCommune])

  const reloadNumeros = useCallback(async _idEdited => {
    const id = _idEdited || idVoie

    if (id) {
      const voie = await getVoie(id)
      const numeros = await getNumeros(id, token)
      await reloadParcelles()
      setVoie(voie)
      setNumeros(numeros)
    } else {
      setVoie(null)
      setNumeros(null)
    }
  }, [idVoie, token, reloadParcelles])

  const reloadNumerosToponyme = useCallback(async _idEdited => {
    const id = _idEdited || idToponyme

    if (id) {
      const toponyme = await getToponyme(id)
      const numeros = await getNumerosToponyme(id, token)
      await reloadParcelles()
      setToponyme(toponyme)
      setNumeros(numeros)
    } else {
      setToponyme(null)
      setNumeros(null)
    }
  }, [idToponyme, token, reloadParcelles])

  const reloadBaseLocale = useCallback(async () => {
    if (balId) {
      const baseLocale = await getBaseLocale(balId)

      setBaseLocale(baseLocale)
    } else {
      setBaseLocale(null)
    }
  }, [balId])

  const refreshBALSync = useCallback(async () => {
    if (baseLocale) {
      const {sync} = baseLocale
      if (sync && sync.status === 'synced' && !sync.isPaused && !isRefrehSyncStat) {
        setIsRefrehSyncStat(true)
        setTimeout(() => {
          reloadBaseLocale()
          setIsRefrehSyncStat(false)
          toaster.notify('De nouvelles modifications ont étaient détectées', {
            description: 'Elles seront automatiquement transmise dans la Base Adresses Nationale d’ici quelques heures.',
            duration: 10
          })
        }, 30000) // Maximum interval between CRON job
      }
    }
  }, [baseLocale, isRefrehSyncStat, reloadBaseLocale])

  const setEditingId = useCallback(editingId => {
    if (token) {
      _setEditingId(editingId)
      setIsEditing(Boolean(editingId))
    }
  }, [token])

  const editingItem = useMemo(() => {
    if (editingId) {
      const voie = voies.find(voie => voie._id === editingId)
      const toponyme = toponymes.find(toponyme => toponyme._id === editingId)
      const numero = numeros && numeros.find(numero => numero._id === editingId)
      return voie || toponyme || numero
    }
  }, [editingId, numeros, voies, toponymes])

  const certifyAllNumeros = useCallback(async () => {
    await certifyBAL(balId, codeCommune, token, {certifie: true})
    await reloadNumeros()

    refreshBALSync()
  }, [balId, codeCommune, token, reloadNumeros, refreshBALSync])

  useEffect(() => {
    reloadGeojson()
    reloadParcelles()
    reloadVoies()
    reloadToponymes()
  }, [codeCommune, reloadGeojson, reloadParcelles, reloadVoies, reloadToponymes])

  // Reload geojson when go back to commune view
  useEffect(() => {
    if (codeCommune && !idVoie) {
      reloadGeojson()
    }
  }, [codeCommune, idVoie, reloadGeojson])

  useEffect(() => {
    reloadNumeros()
  }, [idVoie, reloadNumeros])

  useEffect(() => {
    reloadNumerosToponyme()
  }, [idToponyme, reloadNumerosToponyme])

  useEffect(() => {
    reloadHabilitation()
  }, [balId, token, reloadHabilitation])

  useEffect(() => {
    reloadBaseLocale()
  }, [balId, reloadBaseLocale])

  const value = useMemo(() => ({
    isEditing,
    setIsEditing,
    editingId,
    editingItem,
    parcelles,
    geojson,
    reloadGeojson,
    baseLocale,
    habilitation,
    codeCommune,
    voie,
    setVoie,
    numeros,
    voies,
    toponymes,
    isRefrehSyncStat,
    setEditingId,
    refreshBALSync,
    reloadHabilitation,
    reloadNumeros,
    reloadVoies,
    reloadToponymes,
    reloadBaseLocale,
    reloadNumerosToponyme,
    toponyme,
    certifyAllNumeros
  }), [
    isEditing,
    editingId,
    setEditingId,
    editingItem,
    parcelles,
    geojson,
    reloadGeojson,
    baseLocale,
    reloadBaseLocale,
    habilitation,
    reloadHabilitation,
    codeCommune,
    voie,
    numeros,
    voies,
    toponymes,
    reloadNumeros,
    reloadVoies,
    reloadToponymes,
    reloadNumerosToponyme,
    toponyme,
    certifyAllNumeros,
    isRefrehSyncStat,
    refreshBALSync
  ])

  return (
    <BalDataContext.Provider value={value} {...props} />
  )
})

BalDataContextProvider.propTypes = {
  balId: PropTypes.string,
  codeCommune: PropTypes.string,
  idVoie: PropTypes.string,
  idToponyme: PropTypes.string
}

BalDataContextProvider.defaultProps = {
  balId: null,
  codeCommune: null,
  idVoie: null,
  idToponyme: null
}

export default BalDataContext
