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
import { toaster } from "evergreen-ui";

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
      try {
        await VoiesService.deleteVoie(voie._id);
        toaster.success("La voie a bien été supprimée");
      } catch (error) {
        toaster.danger("La voie n’a pas pu être supprimée", {
          description: error.message,
        });
      }
      await reloadAllDeleted();
    },
    [reloadAllDeleted]
  );

  const onRestoreVoie = useCallback(
    async (voie: PopulateVoie, selectedNumerosIds: string[]) => {
      const restoreVoieDTO: RestoreVoieDTO = {
        numerosIds: selectedNumerosIds,
      };
      let res;
      try {
        res = await VoiesService.restoreVoie(voie._id, restoreVoieDTO);
        toaster.success("La voie a bien été restaurée");
      } catch (error) {
        toaster.danger("La voie n’a pas pu être restaurée", {
          description: error.message,
        });
      }
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
    ]
  );

  const onRemoveNumeros = useCallback(
    async (voie: PopulateVoie) => {
      const deleteBatchNumeroDTO: DeleteBatchNumeroDTO = {
        numerosIds: voie.numeros.map(({ _id }) => String(_id)),
      };
      try {
        await BasesLocalesService.deleteNumeros(
          baseLocale._id,
          deleteBatchNumeroDTO
        );
        toaster.success("Les numéros ont bien été supprimés");
      } catch (error) {
        toaster.danger("Les numéros n’ont pas pu être supprimés", {
          description: error.message,
        });
      }
      await reloadAllDeleted();
    },
    [baseLocale._id, reloadAllDeleted]
  );

  const onRemoveToponyme = useCallback(
    async (toponyme: Toponyme) => {
      try {
        await ToponymesService.deleteToponyme(toponyme._id);
        toaster.success("Le toponyme a bien été supprimé");
      } catch (error) {
        toaster.danger("Le toponyme n’a pas pu être supprimé", {
          description: error.message,
        });
      }
      await reloadAllDeleted();
    },
    [reloadAllDeleted]
  );

  const onRestoreToponyme = useCallback(
    async (toponyme: Toponyme) => {
      let res;
      try {
        res = await ToponymesService.restoreToponyme(toponyme._id);
        toaster.success("Le toponyme a bien été restauré");
      } catch (error) {
        toaster.danger("Le toponyme n’a pas pu être restauré", {
          description: error.message,
        });
      }
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
