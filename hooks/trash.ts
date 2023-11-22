import {useCallback, useContext, useState} from 'react'

import {BasesLocalesService, DeleteBatchNumeroDTO, PopulateVoie, RestoreVoieDTO, Toponyme, ToponymesService, VoiesService} from '@/lib/openapi'
import BalDataContext from '@/contexts/bal-data'
import MapContext from '@/contexts/map'

interface UseTrashType {
  voiesDeleted: PopulateVoie[];
  toponymesDeleted: Toponyme[];
  reloadAllDeleted: () => Promise<void>;
  onRemoveVoie: (voie: PopulateVoie) => Promise<void>;
  onRestoreVoie: (voie: PopulateVoie, selectedNumerosIds: string[]) => Promise<void>;
  onRemoveNumeros: (voie: PopulateVoie) => Promise<void>;
  onRemoveToponyme: (toponyme: Toponyme) => Promise<void>;
  onRestoreToponyme: (toponyme: Toponyme) => Promise<void>;
}

function useTrash(): UseTrashType {
  const {
    baseLocale,
    reloadVoies,
    reloadNumeros,
    reloadToponymes,
    reloadParcelles,
    refreshBALSync
  } = useContext(BalDataContext)
  const {reloadTiles} = useContext(MapContext)
  const [voiesDeleted, setVoiesDeleted] = useState<PopulateVoie[]>([])
  const [toponymesDeleted, setToponymesDeleted] = useState<Toponyme[]>([])

  const reloadAllDeleted = useCallback(async () => {
    const {toponymes, voies} = await BasesLocalesService.findAllDeleted(baseLocale._id)
    setToponymesDeleted(toponymes)
    setVoiesDeleted(voies)
  }, [baseLocale._id])

  const onRemoveVoie = useCallback(async (voie: PopulateVoie) => {
    await VoiesService.deleteVoie(voie._id)
    await reloadAllDeleted()
  }, [reloadAllDeleted])

  const onRestoreVoie = useCallback(async (voie: PopulateVoie, selectedNumerosIds: string[]) => {
    const restoreVoieDTO: RestoreVoieDTO = {
      numerosIds: selectedNumerosIds
    }
    const res = await VoiesService.restoreVoie(voie._id, restoreVoieDTO)
    if (res) {
      await reloadVoies()
      await reloadNumeros()
      await reloadParcelles()
      reloadTiles()
      await reloadAllDeleted()
      await refreshBALSync()
    }
  }, [reloadNumeros, reloadParcelles, reloadVoies, reloadTiles, refreshBALSync, reloadAllDeleted])

  const onRemoveNumeros = useCallback(async (voie: PopulateVoie) => {
    const deleteBatchNumeroDTO: DeleteBatchNumeroDTO = {
      numerosIds: voie.numeros.map(({_id}) => String(_id))
    }
    await BasesLocalesService.deleteNumeros(baseLocale._id, deleteBatchNumeroDTO)
    await reloadAllDeleted()
  }, [baseLocale._id, reloadAllDeleted])

  const onRemoveToponyme = useCallback(async (toponyme: Toponyme) => {
    await ToponymesService.deleteToponyme(toponyme._id)
    await reloadAllDeleted()
  }, [reloadAllDeleted])

  const onRestoreToponyme = useCallback(async (toponyme: Toponyme) => {
    const res = await ToponymesService.restoreToponyme(toponyme._id)

    if (res) {
      await reloadParcelles()
      await reloadToponymes()
      reloadTiles()
      await refreshBALSync()
      await reloadAllDeleted()
    }
  }, [reloadParcelles, reloadToponymes, reloadTiles, refreshBALSync, reloadAllDeleted])

  return {
    voiesDeleted,
    toponymesDeleted,
    onRemoveVoie,
    onRestoreVoie,
    onRemoveNumeros,
    onRemoveToponyme,
    onRestoreToponyme,
    reloadAllDeleted
  }
}

export default useTrash
