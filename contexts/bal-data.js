import React, {useState, useMemo, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {toaster} from 'evergreen-ui'

import {
  getHabilitation,
  getParcelles,
  getCommuneGeoJson,
  getCommune,
  getNumeros,
  getVoies,
  getBaseLocale,
  getToponymes,
  getNumerosToponyme,
  getToponyme,
  certifyBAL
} from '../lib/bal-api'

import TokenContext from '@/contexts/token'

const BalDataContext = React.createContext()

export const BalDataContextProvider = React.memo(({initialBaseLocale, initialCommune, initialVoie, idToponyme, ...props}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, _setEditingId] = useState()
  const [parcelles, setParcelles] = useState([])
  const [geojson, setGeojson] = useState()
  const [numeros, setNumeros] = useState()
  const [voies, setVoies] = useState()
  const [toponymes, setToponymes] = useState()
  const [voie, setVoie] = useState(initialVoie)
  const [toponyme, setToponyme] = useState()
  const [commune, setCommune] = useState(initialCommune)
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
    if (commune?.code) {
      const parcelles = await getParcelles(baseLocale._id, commune?.code)
      setParcelles(parcelles)
    } else {
      setParcelles([])
    }
  }, [baseLocale._id, commune])

  const reloadGeojson = useCallback(async () => {
    if (commune?.code) {
      const geojson = await getCommuneGeoJson(baseLocale._id, commune?.code)
      setGeojson(geojson)
    } else {
      setGeojson(null)
    }
  }, [baseLocale._id, commune])

  const reloadVoies = useCallback(async () => {
    if (commune?.code) {
      const voies = await getVoies(baseLocale._id, commune?.code)
      setVoies(voies)
    } else {
      setVoies(null)
    }
  }, [baseLocale._id, commune])

  const reloadToponymes = useCallback(async () => {
    if (commune?.code) {
      const toponymes = await getToponymes(baseLocale._id, commune?.code)
      setToponymes(toponymes)
    } else {
      setToponymes(null)
    }
  }, [baseLocale._id, commune])

  const reloadNumeros = useCallback(async () => {
    const numeros = await getNumeros(initialVoie._id, token)
    await reloadParcelles()
    setNumeros(numeros)
  }, [initialVoie, token, reloadParcelles])

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

  const reloadCommune = useCallback(async () => {
    const baseLocaleCommune = await getCommune(baseLocale._id, initialCommune.code)
    setCommune({...initialCommune, ...baseLocaleCommune})
  }, [baseLocale._id, initialCommune])

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
    await certifyBAL(baseLocale._id, commune?.code, token, {certifie: true})
    await reloadNumeros()

    refreshBALSync()
  }, [baseLocale._id, commune, token, reloadNumeros, refreshBALSync])

  useEffect(() => {
    if (initialVoie) {
      setVoie(initialVoie)
      reloadNumeros()
    } else {
      reloadGeojson() // Reload geojson when go back to commune view
      reloadVoies()
      reloadToponymes()
      setVoie(null)
      setNumeros(null)
    }
  }, [initialVoie, reloadNumeros, reloadGeojson, reloadParcelles, reloadVoies, reloadToponymes])

  useEffect(() => {
    reloadParcelles()
  }, [commune, reloadParcelles])

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
    commune,
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
    reloadCommune,
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
    reloadCommune,
    commune,
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
  initialCommune: PropTypes.shape({
    code: PropTypes.string.isRequired
  }),
  initialVoie: PropTypes.object,
  idToponyme: PropTypes.string
}

BalDataContextProvider.defaultProps = {
  initialCommune: null,
  initialVoie: null,
  idToponyme: null
}

export default BalDataContext
