import { useCallback, useContext, useState } from "react";

import {
  BasesLocalesService,
  DeleteBatchNumeroDTO,
  PopulateVoie,
  RestoreVoieDTO,
  Toponyme,
  ToponymesService,
  VoiesService,
} from "@/lib/openapi";
import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";
import LayoutContext from "@/contexts/layout";

interface UseTrashType {
  voiesDeleted: PopulateVoie[];
  toponymesDeleted: Toponyme[];
  reloadAllDeleted: () => Promise<void>;
  onRemoveVoie: (voie: PopulateVoie) => Promise<void>;
  onRestoreVoie: (
    voie: PopulateVoie,
    selectedNumerosIds: string[]
  ) => Promise<void>;
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
    refreshBALSync,
  } = useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { toaster } = useContext(LayoutContext);
  const [voiesDeleted, setVoiesDeleted] = useState<PopulateVoie[]>([]);
  const [toponymesDeleted, setToponymesDeleted] = useState<Toponyme[]>([]);

  const reloadAllDeleted = useCallback(async () => {
    const { toponymes, voies } = await BasesLocalesService.findAllDeleted(
      baseLocale._id
    );
    setToponymesDeleted(toponymes);
    setVoiesDeleted(voies);
  }, [baseLocale._id]);

  const onRemoveVoie = useCallback(
    async (voie: PopulateVoie) => {
      const deleteVoie = toaster(
        () => VoiesService.deleteVoie(voie._id),
        "La voie a bien été supprimée",
        "La voie n’a pas pu être supprimée"
      );
      await deleteVoie();
      await reloadAllDeleted();
    },
    [toaster, reloadAllDeleted]
  );

  const onRestoreVoie = useCallback(
    async (voie: PopulateVoie, selectedNumerosIds: string[]) => {
      const restoreVoieDTO: RestoreVoieDTO = {
        numerosIds: selectedNumerosIds,
      };
      const restoreVoie = toaster(
        () => VoiesService.restoreVoie(voie._id, restoreVoieDTO),
        "La voie a bien été restaurée",
        "La voie n’a pas pu être restaurée"
      );
      const res = await restoreVoie();
      if (res) {
        await reloadVoies();
        await reloadNumeros();
        await reloadParcelles();
        reloadTiles();
        await reloadAllDeleted();
        await refreshBALSync();
      }
    },
    [
      reloadNumeros,
      reloadParcelles,
      reloadVoies,
      reloadTiles,
      refreshBALSync,
      reloadAllDeleted,
      toaster,
    ]
  );

  const onRemoveNumeros = useCallback(
    async (voie: PopulateVoie) => {
      const deleteBatchNumeroDTO: DeleteBatchNumeroDTO = {
        numerosIds: voie.numeros.map(({ _id }) => String(_id)),
      };
      const deleteNumeros = toaster(
        () =>
          BasesLocalesService.deleteNumeros(
            baseLocale._id,
            deleteBatchNumeroDTO
          ),
        "Les numéros ont bien été supprimés",
        "Les numéros n’ont pas pu être supprimés"
      );
      await deleteNumeros();
      await reloadAllDeleted();
    },
    [baseLocale._id, reloadAllDeleted, toaster]
  );

  const onRemoveToponyme = useCallback(
    async (toponyme: Toponyme) => {
      const deleteToponyme = toaster(
        () => ToponymesService.deleteToponyme(toponyme._id),
        "Le toponyme a bien été supprimé",
        "Le toponyme n’a pas pu être supprimé"
      );
      await deleteToponyme();
      await reloadAllDeleted();
    },
    [reloadAllDeleted, toaster]
  );

  const onRestoreToponyme = useCallback(
    async (toponyme: Toponyme) => {
      const restoreToponyme = toaster(
        () => ToponymesService.restoreToponyme(toponyme._id),
        "Le toponyme a bien été restauré",
        "Le toponyme n’a pas pu être restauré"
      );
      const res = await restoreToponyme();
      if (res) {
        await reloadParcelles();
        await reloadToponymes();
        reloadTiles();
        await refreshBALSync();
        await reloadAllDeleted();
      }
    },
    [
      reloadParcelles,
      reloadToponymes,
      reloadTiles,
      refreshBALSync,
      reloadAllDeleted,
      toaster,
    ]
  );

  return {
    voiesDeleted,
    toponymesDeleted,
    onRemoveVoie,
    onRestoreVoie,
    onRemoveNumeros,
    onRemoveToponyme,
    onRestoreToponyme,
    reloadAllDeleted,
  };
}

export default useTrash;
