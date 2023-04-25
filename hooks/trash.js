
import {useCallback, useContext, useState} from 'react'

import {getVoiesDeleted, getToponymesDeleted, restoreToponyme, removeToponyme, removeVoie, restoreVoie, removeMultipleNumeros} from '@/lib/bal-api'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

function useTrash() {
  const {
    baseLocale,
    reloadVoies,
    reloadNumeros,
    reloadToponymes,
    reloadGeojson,
    reloadParcelles,
    refreshBALSync
  } = useContext(BalDataContext)
  const {token} = useContext(TokenContext)
  const [voiesDeleted, setVoiesDeleted] = useState([])
  const [toponymesDeleted, setToponymesDeleted] = useState([])

  const reloadVoiesDeleted = useCallback(async () => {
    const res = await getVoiesDeleted(baseLocale._id)
    setVoiesDeleted(res)
  }, [baseLocale._id, setVoiesDeleted])

  const reloadToponymesDelete = useCallback(async () => {
    const res = await getToponymesDeleted(baseLocale._id)
    setToponymesDeleted(res)
  }, [baseLocale._id, setToponymesDeleted])

  const onRemoveVoie = useCallback(async voie => {
    const res = await removeVoie(voie._id, token)
    if (res) {
      await reloadVoiesDeleted()
    }
  }, [token, reloadVoiesDeleted])

  const onRestoreVoie = useCallback(async (voie, selectedNumerosIds) => {
    const res = await restoreVoie(voie._id, {numerosIds: selectedNumerosIds}, token)

    if (res) {
      await reloadVoies()
      await reloadNumeros()
      await reloadParcelles()
      await reloadGeojson()
      await reloadVoiesDeleted()
      await refreshBALSync()
    }
  }, [token, reloadNumeros, reloadParcelles, reloadVoies, reloadGeojson, refreshBALSync, reloadVoiesDeleted])

  const onRemoveNumeros = useCallback(async voie => {
    const res = await removeMultipleNumeros(baseLocale._id, {numerosIds: voie.numeros.map(n => n._id)}, token)
    if (res) {
      await reloadVoiesDeleted()
    }
  }, [token, reloadVoiesDeleted, removeMultipleNumeros])

  const onRemoveToponyme = useCallback(async toponyme => {
    const res = await removeToponyme(toponyme._id, token)
    if (res) {
      await reloadToponymesDelete()
    }
  }, [token, reloadToponymesDelete])

  const onRestoreToponyme = useCallback(async toponyme => {
    const res = await restoreToponyme(toponyme._id, token)

    if (res) {
      await reloadParcelles()
      await reloadToponymes()
      await reloadGeojson()
      await refreshBALSync()
      await reloadToponymesDelete()
    }
  }, [token, reloadParcelles, reloadToponymes, reloadGeojson, refreshBALSync, reloadToponymesDelete])

  return {
    voiesDeleted,
    toponymesDeleted,
    onRemoveVoie,
    onRestoreVoie,
    onRemoveNumeros,
    onRemoveToponyme,
    onRestoreToponyme,
    reloadVoiesDeleted,
    reloadToponymesDelete,
  }
}

export default useTrash
