import { useCallback, useContext, useMemo, useState } from "react";
import { Paragraph, Pane, Text, Button, defaultTheme } from "evergreen-ui";
import { useRouter } from "next/navigation";
import { normalize } from "@ban-team/adresses-util/lib/voies";

import BalDataContext from "@/contexts/bal-data";
import {
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  Voie,
  VoiesService,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import DialogWarningAction from "@/components/dialog-warning-action";
import MapContext from "@/contexts/map";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import MatomoTrackingContext, {
  MatomoEventAction,
  MatomoEventCategory,
} from "@/contexts/matomo-tracking";

interface WarningVoieDoublonProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
}

function WarningVoieDoublon({ baseLocale, voie }: WarningVoieDoublonProps) {
  const {
    voies,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    refreshBALSync,
    reloadVoieAlerts,
  } = useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);
  const [toFusion, setToFusion] = useState<ExtendedVoieDTO | null>(null);
  const [onFusionLoading, setOnFusionLoading] = useState<boolean>(false);
  const { toaster } = useContext(LayoutContext);
  const router = useRouter();

  const otherVoieIds = useMemo(() => {
    const voieNomNormalize = normalize(voie.nom);
    return voies
      .filter(
        ({ id, nom }) => id !== voie.id && normalize(nom) === voieNomNormalize
      )
      .map(({ id }) => id);
  }, [voie, voies]);

  const onFusionVoie = useCallback(async () => {
    setOnFusionLoading(true);
    const findVoiesSameName = () => {
      const voieNomNormalize = normalize(voie.nom);
      return voies
        .filter(
          ({ id, nom }) => id !== voie.id && normalize(nom) === voieNomNormalize
        )
        .map(({ id }) => id);
    };

    const fusionVoies = toaster(
      async () => {
        const voie: Voie = await VoiesService.fusionVoies(toFusion.id, {
          otherVoieIds: findVoiesSameName(),
        });
        const voies = await reloadVoies();
        await reloadParcelles();
        reloadTiles();
        refreshBALSync();
        // RELOAD ALERTS
        reloadVoieAlerts(toFusion, voies);
        await router.push(
          `/bal/${baseLocale.id}/${TabsEnum.VOIES}/${voie.id}/numeros`
        );
      },
      "Les voies ont été fusionné",
      "Les voies n’ont pas pu être fusionné"
    );

    await fusionVoies();
    matomoTrackEvent(
      MatomoEventCategory.QUALITY,
      MatomoEventAction[MatomoEventCategory.QUALITY].FUSION_VOIES
    );

    setOnFusionLoading(false);
    setToFusion(null);
  }, [
    toaster,
    matomoTrackEvent,
    toFusion,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    reloadTiles,
    refreshBALSync,
    reloadVoieAlerts,
    baseLocale.id,
    router,
  ]);

  return (
    <>
      <DialogWarningAction
        confirmLabel="Fusionner les voies"
        isShown={Boolean(toFusion)}
        content={
          <Paragraph>
            Êtes vous bien sûr de vouloir fusionner les{" "}
            {otherVoieIds.length + 1} voies avec le nom {voie.nom}
          </Paragraph>
        }
        isLoading={onFusionLoading}
        onCancel={() => {
          setToFusion(null);
        }}
        onConfirm={onFusionVoie}
      />
      <>
        <Pane marginBottom={8}>
          <Text>Plusieurs voies ont le même nom</Text>
        </Pane>
        <Button
          onClick={() => setToFusion(voie)}
          size="small"
          title="Fusionner les voies avec le même nom"
          appearance="primary"
          style={{ backgroundColor: defaultTheme.colors.purple600 }}
        >
          Fusionner les voies
        </Button>
      </>
    </>
  );
}

export default WarningVoieDoublon;
