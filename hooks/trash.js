
import {useCallback, useContext, useState} from 'react'

import {getAllDeleted, restoreToponyme, removeToponyme, removeVoie, restoreVoie, removeMultipleNumeros} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import MapContext from '@/contexts/map'
import TokenContext from '@/contexts/token'

function useTrash() {
  const {
    baseLocale,
    reloadVoies,
    reloadNumeros,
    reloadToponymes,
    reloadParcelles,
    refreshBALSync
  } = useContext(BalDataContext)
  const {reloadTiles} = useContext(MapContext)
  const {token} = useContext(TokenContext)
  const [voiesDeleted, setVoiesDeleted] = useState([])
  const [toponymesDeleted, setToponymesDeleted] = useState([])

  const reloadAllDeleted = useCallback(async () => {
    const res = await getAllDeleted(baseLocale._id)
    setToponymesDeleted(res.toponymes)
    setVoiesDeleted(res.voies)
  }, [baseLocale._id])

  const onRemoveVoie = useCallback(async voie => {
    const res = await removeVoie(voie._id, token)
    if (res) {
      await reloadAllDeleted()
    }
  }, [token, reloadAllDeleted])

  const onRestoreVoie = useCallback(async (voie, selectedNumerosIds) => {
    const res = await restoreVoie(voie._id, {numerosIds: selectedNumerosIds}, token)
    if (res) {
      await reloadVoies()
      await reloadNumeros()
      await reloadParcelles()
      reloadTiles()
      await reloadAllDeleted()
      await refreshBALSync()
    }
  }, [token, reloadNumeros, reloadParcelles, reloadVoies, reloadTiles, refreshBALSync, reloadAllDeleted])

  const onRemoveNumeros = useCallback(async voie => {
    const res = await removeMultipleNumeros(baseLocale._id, {numerosIds: voie.numeros.map(n => n._id)}, token)
    if (res) {
      await reloadAllDeleted()
    }
  }, [baseLocale._id, token, reloadAllDeleted])

  const onRemoveToponyme = useCallback(async toponyme => {
    const res = await removeToponyme(toponyme._id, token)
    if (res) {
      await reloadAllDeleted()
    }
  }, [token, reloadAllDeleted])

  const onRestoreToponyme = useCallback(async toponyme => {
    const res = await restoreToponyme(toponyme._id, token)

    if (res) {
      await reloadParcelles()
      await reloadToponymes()
      reloadTiles()
      await refreshBALSync()
      await reloadAllDeleted()
    }
  }, [token, reloadParcelles, reloadToponymes, reloadTiles, refreshBALSync, reloadAllDeleted])

  return {
    voiesDeleted,
    toponymesDeleted,
    onRemoveVoie,
    onRestoreVoie,
    onRemoveNumeros,
    onRemoveToponyme,
    onRestoreToponyme,
    reloadAllDeleted,
  }
}

export default useTrash
