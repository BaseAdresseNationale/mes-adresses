"use client";

import { useCallback, useContext, useEffect, useMemo } from "react";
import { sortBy } from "lodash";
import { Text } from "evergreen-ui";
import { useRouter } from "next/navigation";
import { normalizeSort } from "@/lib/normalize";

import BalDataContext from "@/contexts/bal-data";
import LayoutContext from "@/contexts/layout";
import MapContext from "@/contexts/map";
import { TilesLayerMode } from "@/components/map/layers/tiles";
import { AlertNumero, AlertVoie } from "@/lib/alerts/alerts.types";
import AlertsContext from "@/contexts/alerts";
import AlertsBatchProcessor, {
  AlertBatchItem,
} from "@/components/bal/alerts-batch-processor";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";

export default function VoiesPage() {
  const { voies, baseLocale } = useContext(BalDataContext);
  const { setTileLayersMode } = useContext(MapContext);
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);

  const { voiesAlerts, numerosAlerts } = useContext(AlertsContext);

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.VOIE);
  }, [setTileLayersMode]);

  useEffect(() => {
    setBreadcrumbs(<Text aria-current="page">Voies</Text>);

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs]);

  const getVoieAlerts = useCallback(
    (voieId: string): (AlertVoie | AlertNumero)[] => {
      const voieWarnings = voiesAlerts[voieId] || [];

      const numerosWarnings = Object.values(numerosAlerts)
        .flat()
        .filter((alert) => alert.voieId === voieId);
      return [...voieWarnings, ...numerosWarnings];
    },
    [voiesAlerts, numerosAlerts]
  );

  const batchItems: AlertBatchItem[] = useMemo(() => {
    const allSorted = sortBy(
      voies.filter(({ id }) => getVoieAlerts(id).length > 0),
      (v) => normalizeSort(v.nom)
    );
    return allSorted.flatMap((voie) => {
      const voieWarnings = (voiesAlerts[voie.id] || []).map((alert) => ({
        voie,
        alert,
      }));
      const numeroWarnings = Object.entries(numerosAlerts)
        .filter(([, alerts]) => alerts.some((a) => a.voieId === voie.id))
        .flatMap(([numeroId, alerts]) =>
          alerts
            .filter((a) => a.voieId === voie.id)
            .map((alert) => ({ voie, alert, numeroId }))
        );
      return [...voieWarnings, ...numeroWarnings];
    });
  }, [voies, getVoieAlerts, voiesAlerts, numerosAlerts]);

  const handleClose = useCallback(() => {
    const query = batchItems?.length > 0 ? "?filter=with-suggestions" : "";

    router.push(`/bal/${baseLocale.id}/${TabsEnum.VOIES}${query}`);
  }, [baseLocale.id, batchItems?.length, router]);

  return (
    <AlertsBatchProcessor
      items={batchItems}
      onClose={handleClose}
      onFinish={handleClose}
    />
  );
}
