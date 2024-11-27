import { useCallback, useContext, useState } from "react";

import {
  BasesLocalesService,
  DeleteBatchNumeroDTO,
  RestoreVoieDTO,
  Toponyme,
  ToponymesService,
  Voie,
  VoiesService,
} from "@/lib/openapi-api-bal";
import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";
import LayoutContext from "@/contexts/layout";

interface UseTrashType {
  voiesDeleted: Voie[];
  toponymesDeleted: Toponyme[];
  reloadAllDeleted: () => Promise<void>;
  onRemoveVoie: (voie: Voie) => Promise<void>;
  onRestoreVoie: (voie: Voie, selectedNumerosIds: string[]) => Promise<void>;
  onRemoveNumeros: (voie: Voie) => Promise<void>;
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
  const [voiesDeleted, setVoiesDeleted] = useState<Voie[]>([]);
  const [toponymesDeleted, setToponymesDeleted] = useState<Toponyme[]>([]);

  const reloadAllDeleted = useCallback(async () => {
    const { toponymes, voies } = await BasesLocalesService.findAllDeleted(
      baseLocale.id
    );
    setToponymesDeleted(toponymes);
    setVoiesDeleted(voies);
  }, [baseLocale.id]);

  const onRemoveVoie = useCallback(
    async (voie: Voie) => {
      const deleteVoie = toaster(
        () => VoiesService.deleteVoie(voie.id),
        "La voie a bien été supprimée",
        "La voie n’a pas pu être supprimée"
      );
      await deleteVoie();
      await reloadAllDeleted();
    },
    [toaster, reloadAllDeleted]
  );

  const onRestoreVoie = useCallback(
    async (voie: Voie, selectedNumerosIds: string[]) => {
      const restoreVoieDTO: RestoreVoieDTO = {
        numerosIds: selectedNumerosIds,
      };
      const restoreVoie = toaster(
        () => VoiesService.restoreVoie(voie.id, restoreVoieDTO),
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
    async (voie: Voie) => {
      const deleteBatchNumeroDTO: DeleteBatchNumeroDTO = {
        numerosIds: voie.numeros.map(({ id }) => String(id)),
      };
      const deleteNumeros = toaster(
        () =>
          BasesLocalesService.deleteNumeros(
            baseLocale.id,
            deleteBatchNumeroDTO
          ),
        "Les numéros ont bien été supprimés",
        "Les numéros n’ont pas pu être supprimés"
      );
      await deleteNumeros();
      await reloadAllDeleted();
    },
    [baseLocale.id, reloadAllDeleted, toaster]
  );

  const onRemoveToponyme = useCallback(
    async (toponyme: Toponyme) => {
      const deleteToponyme = toaster(
        () => ToponymesService.deleteToponyme(toponyme.id),
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
        () => ToponymesService.restoreToponyme(toponyme.id),
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
