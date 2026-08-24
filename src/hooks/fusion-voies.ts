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
import EventsContext from "@/contexts/events";

export function useFusionVoies(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const {
    voies,
    reloadVoies,
    reloadParcelles,
    reloadVoieAlerts,
    reloadBaseLocale,
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
          reloadBaseLocale();
          // RELOAD ALERTS
          reloadVoieAlerts(newVoie as ExtendedVoieDTO, voies);
          return newVoie;
        },
        "Les voies ont été fusionné",
        "Les voies n’ont pas pu être fusionné"
      );

      const newVoie = await fusionVoies();
      matomoTrackEvent(
        MatomoEventCategory.QUALITY,
        MatomoEventAction[MatomoEventCategory.QUALITY].FUSION_VOIES
      );

      setLoading(false);
      return newVoie;
    },
    [
      toaster,
      matomoTrackEvent,
      voies,
      reloadVoies,
      reloadParcelles,
      reloadTiles,
      reloadBaseLocale,
      reloadVoieAlerts,
      setLoading,
    ]
  );

  return { onFusionVoie };
}
