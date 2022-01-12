import React, {useState, useMemo, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {toaster} from 'evergreen-ui'

import {getHabilitation, getParcelles, getCommuneGeoJson, getNumeros, getVoies, getVoie, getBaseLocale, getToponymes, getNumerosToponyme, getToponyme, certifyBAL} from '../lib/bal-api'

import TokenContext from '@/contexts/token'

const BalDataContext = React.createContext()

export const BalDataContextProvider = React.memo(({initialBaseLocale, codeCommune, idVoie, idToponyme, ...props}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, _setEditingId] = useState()
  const [parcelles, setParcelles] = useState([])
  const [geojson, setGeojson] = useState()
  const [numeros, setNumeros] = useState()
  const [voies, setVoies] = useState()
  const [toponymes, setToponymes] = useState()
  const [voie, setVoie] = useState(null)
  const [toponyme, setToponyme] = useState()
  const [baseLocale, setBaseLocale] = useState(initialBaseLocale)
  const [habilitation, setHabilitation] = useState(null)
  const [isRefrehSyncStat, setIsRefrehSyncStat] = useState(false)

  const {token} = useContext(TokenContext)

  const reloadHabilitation = useCallback(async () => {
    if (token) {
      try {
        const habilitation = await getHabilitation(token, baseLocale._id)
        setHabilitation(habilitation)
      } catch {
        setHabilitation(null)
      }
    }
  }, [baseLocale._id, token])

  const reloadParcelles = useCallback(async () => {
    if (codeCommune) {
      const parcelles = await getParcelles(baseLocale._id, codeCommune)
      setParcelles(parcelles)
    } else {
      setParcelles([])
    }
  }, [baseLocale._id, codeCommune])

  const reloadGeojson = useCallback(async () => {
    if (codeCommune) {
      const geojson = await getCommuneGeoJson(baseLocale._id, codeCommune)
      setGeojson(geojson)
    } else {
      setGeojson(null)
    }
  }, [baseLocale._id, codeCommune])

  const reloadVoies = useCallback(async () => {
    if (codeCommune) {
      const voies = await getVoies(baseLocale._id, codeCommune)
      setVoies(voies)
    } else {
      setVoies(null)
    }
  }, [baseLocale._id, codeCommune])

  const reloadToponymes = useCallback(async () => {
    if (codeCommune) {
      const toponymes = await getToponymes(baseLocale._id, codeCommune)
      setToponymes(toponymes)
    } else {
      setToponymes(null)
    }
  }, [baseLocale._id, codeCommune])

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
    const bal = await getBaseLocale(baseLocale._id)
    setBaseLocale(bal)
  }, [baseLocale._id])

  const refreshBALSync = useCallback(async () => {
    if (baseLocale) {
      const {sync} = baseLocale
      if (sync && sync.status === 'synced' && !sync.isPaused && !isRefrehSyncStat) {
        setIsRefrehSyncStat(true)
        setTimeout(() => {
          reloadBaseLocale()
          setIsRefrehSyncStat(false)
          toaster.notify('De nouvelles modifications ont été détectées', {
            description: 'Elles seront automatiquement transmises dans la Base Adresses Nationale d’ici quelques heures.',
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
    await certifyBAL(baseLocale._id, codeCommune, token, {certifie: true})
    await reloadNumeros()

    refreshBALSync()
  }, [baseLocale._id, codeCommune, token, reloadNumeros, refreshBALSync])

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
  }, [token, reloadHabilitation])

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
  initialBaseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }).isRequired,
  codeCommune: PropTypes.string,
  idVoie: PropTypes.string,
  idToponyme: PropTypes.string
}

BalDataContextProvider.defaultProps = {
  codeCommune: null,
  idVoie: null,
  idToponyme: null
}

export default BalDataContext
