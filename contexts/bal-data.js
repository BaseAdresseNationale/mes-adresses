import React, {useState, useMemo, useCallback, useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {toaster} from 'evergreen-ui'

import {getCommune} from '@/lib/geo-api'

import {
  getParcelles,
  getCommuneGeoJson,
  getNumeros,
  getVoies,
  getBaseLocale,
  getToponymes,
  getNumerosToponyme,
  certifyBAL
} from '@/lib/bal-api'

import TokenContext from '@/contexts/token'

import useHabilitation from '@/hooks/habilitation'

const BalDataContext = React.createContext()

export const BalDataContextProvider = React.memo(({
  initialBaseLocale, initialCommune, initialVoie, initialToponyme, initialVoies, initialToponymes, initialNumeros, ...props
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, _setEditingId] = useState(null)
  const [parcelles, setParcelles] = useState([])
  const [geojson, setGeojson] = useState()
  const [numeros, setNumeros] = useState(initialNumeros)
  const [voies, setVoies] = useState(initialVoies)
  const [toponymes, setToponymes] = useState(initialToponymes)
  const [voie, setVoie] = useState(initialVoie)
  const [toponyme, setToponyme] = useState(initialToponyme)
  const [commune, setCommune] = useState(initialCommune)
  const [baseLocale, setBaseLocale] = useState(initialBaseLocale)
  const [isRefrehSyncStat, setIsRefrehSyncStat] = useState(false)

  const {token} = useContext(TokenContext)

  const [habilitation, reloadHabilitation, isHabilitationValid] = useHabilitation(initialBaseLocale, token)

  const reloadParcelles = useCallback(async () => {
    const parcelles = await getParcelles(baseLocale._id)
    setParcelles(parcelles)
  }, [baseLocale._id])

  const reloadGeojson = useCallback(async () => {
    const geojson = await getCommuneGeoJson(baseLocale._id)
    setGeojson(geojson)
  }, [baseLocale._id])

  const reloadVoies = useCallback(async () => {
    const voies = await getVoies(baseLocale._id)
    setVoies(voies)
  }, [baseLocale._id])

  const reloadToponymes = useCallback(async () => {
    const toponymes = await getToponymes(baseLocale._id)
    setToponymes(toponymes)
  }, [baseLocale._id])

  const reloadNumeros = useCallback(async () => {
    let numeros
    if (voie) {
      numeros = await getNumeros(voie._id, token)
    } else if (toponyme) {
      numeros = await getNumerosToponyme(toponyme._id, token)
    }

    if (numeros) {
      setNumeros(numeros)
    }
  }, [voie, toponyme, token])

  const reloadBaseLocale = useCallback(async () => {
    const bal = await getBaseLocale(baseLocale._id)
    const commune = await getCommune(bal.commune, {
      fields: 'contour'
    })

    setBaseLocale(bal)
    setCommune(commune)
  }, [baseLocale._id])

  const refreshBALSync = useCallback(async () => {
    const {sync} = baseLocale
    if (isHabilitationValid && sync && sync.status === 'synced' && !sync.isPaused && !isRefrehSyncStat) {
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
  }, [baseLocale, isHabilitationValid, isRefrehSyncStat, reloadBaseLocale])

  const setEditingId = useCallback(editingId => {
    if (token) {
      _setEditingId(editingId)
      setIsEditing(Boolean(editingId))
    }
  }, [token])

  const editingItem = useMemo(() => {
    if (editingId) {
      if (voie?._id === editingId) {
        return voie
      }

      if (toponyme?._id === editingId) {
        return toponyme
      }

      return numeros && numeros.find(numero => numero._id === editingId)
    }
  }, [editingId, numeros, voie, toponyme])

  const certifyAllNumeros = useCallback(async () => {
    await certifyBAL(baseLocale._id, token, {certifie: true})
    await reloadNumeros()

    refreshBALSync()
  }, [baseLocale._id, token, reloadNumeros, refreshBALSync])

  // Update states on client side load
  useEffect(() => {
    setVoie(initialVoie)
  }, [initialVoie])

  useEffect(() => {
    setToponyme(initialToponyme)
  }, [initialToponyme])

  useEffect(() => {
    setVoies(initialVoies)
  }, [initialVoie, initialVoies])

  useEffect(() => {
    if (initialToponymes) {
      setToponymes(initialToponymes)
    }
  }, [initialToponymes])

  useEffect(() => {
    setNumeros(initialNumeros)
  }, [initialNumeros])

  useEffect(() => {
    reloadGeojson()
    reloadParcelles()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({
    isEditing,
    setIsEditing,
    editingId,
    editingItem,
    reloadGeojson,
    baseLocale,
    habilitation,
    isHabilitationValid,
    commune,
    geojson,
    parcelles,
    voie: voie || initialVoie,
    toponyme: toponyme || initialToponyme,
    numeros: numeros || initialNumeros,
    voies: voies || initialVoies,
    toponymes: toponymes || initialToponymes,
    isRefrehSyncStat,
    setEditingId,
    refreshBALSync,
    reloadHabilitation,
    reloadParcelles,
    reloadNumeros,
    reloadVoies,
    reloadToponymes,
    reloadBaseLocale,
    setVoie,
    setToponyme,
    certifyAllNumeros
  }), [
    isEditing,
    editingId,
    setEditingId,
    editingItem,
    parcelles,
    reloadParcelles,
    geojson,
    reloadGeojson,
    baseLocale,
    reloadBaseLocale,
    habilitation,
    isHabilitationValid,
    reloadHabilitation,
    commune,
    voie,
    numeros,
    initialVoie,
    initialToponyme,
    initialNumeros,
    initialVoies,
    initialToponymes,
    voies,
    toponymes,
    reloadNumeros,
    reloadVoies,
    reloadToponymes,
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
  initialToponyme: PropTypes.object,
  initialVoies: PropTypes.array,
  initialToponymes: PropTypes.array,
  initialNumeros: PropTypes.array
}

BalDataContextProvider.defaultProps = {
  initialCommune: null,
  initialVoie: null,
  initialToponyme: null,
  initialVoies: null,
  initialToponymes: null,
  initialNumeros: null
}

export default BalDataContext
