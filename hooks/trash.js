
import {useCallback, useContext, useState} from 'react'
import {groupBy} from 'lodash'

import {getVoies, getNumerosByBal, getToponymes, restoreToponyme, removeToponyme, removeVoie, restoreVoie, removeMultipleNumeros} from '@/lib/bal-api'

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

  const reloadVoiesDeleted = useCallback(async () => {
    const numerosDeleted = await getNumerosByBal(baseLocale._id, token, true)
    const voies = await getVoies(baseLocale._id)
    const numerosDeletedByVoie = groupBy(numerosDeleted, 'voie')

    const result = []
    for (const voieId in numerosDeletedByVoie) {
      if (Object.hasOwnProperty.call(numerosDeletedByVoie, voieId)) {
        const voieNumerosDeleted = numerosDeletedByVoie[voieId]
        const voie = voies.find(({_id}) => _id === voieId)
        voie.numeros = voieNumerosDeleted
        result.push(voie)
      }
    }

    setVoiesDeleted(result)
  }, [baseLocale._id, token, setVoiesDeleted])

  const reloadToponymesDelete = useCallback(async () => {
    const res = await getToponymes(baseLocale._id, true)
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
      reloadTiles()
      await reloadVoiesDeleted()
      await refreshBALSync()
    }
  }, [token, reloadNumeros, reloadParcelles, reloadVoies, reloadTiles, refreshBALSync, reloadVoiesDeleted])

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
      reloadTiles()
      await refreshBALSync()
      await reloadToponymesDelete()
    }
  }, [token, reloadParcelles, reloadToponymes, reloadTiles, refreshBALSync, reloadToponymesDelete])

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
