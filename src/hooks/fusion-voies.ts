"use client";
import React, { useCallback, useContext } from "react";
import { normalize } from "@ban-team/adresses-util/lib/voies";

import BalDataContext from "@/contexts/bal-data";
import { ExtendedVoieDTO, Voie, VoiesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import MapContext from "@/contexts/map";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

export function useFusionVoies(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const {
    voies,
    reloadVoies,
    reloadParcelles,
    refreshBALSync,
    reloadVoieAlerts,
  } = useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);
  const { toaster } = useContext(LayoutContext);

  const onFusionVoie = useCallback(
    async (voie: ExtendedVoieDTO) => {
      setLoading(true);

      const findVoiesSameName = () => {
        const voieNomNormalize = normalize(voie.nom);
        return voies
          .filter(
            ({ id, nom }) =>
              id !== voie.id && normalize(nom) === voieNomNormalize
          )
          .map(({ id }) => id);
      };

      const fusionVoies = toaster(
        async () => {
          const newVoie: Voie = await VoiesService.fusionVoies(voie.id, {
            otherVoieIds: findVoiesSameName(),
          });
          const voies = await reloadVoies();
          await reloadParcelles();
          reloadTiles();
          refreshBALSync();
          // RELOAD ALERTS
          reloadVoieAlerts(newVoie as ExtendedVoieDTO, voies);
        },
        "Les voies ont été fusionné",
        "Les voies n’ont pas pu être fusionné"
      );

      await fusionVoies();
      matomoTrackEvent(
        MatomoEventCategory.QUALITY,
        MatomoEventAction[MatomoEventCategory.QUALITY].FUSION_VOIES
      );

      setLoading(false);
    },
    [
      toaster,
      matomoTrackEvent,
      voies,
      reloadVoies,
      reloadParcelles,
      reloadTiles,
      refreshBALSync,
      reloadVoieAlerts,
      setLoading,
    ]
  );

  return { onFusionVoie };
}
