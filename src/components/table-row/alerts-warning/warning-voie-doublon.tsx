import { useCallback, useContext, useState } from "react";
import { Paragraph, Pane, Text, Button, defaultTheme } from "evergreen-ui";
import { useRouter } from "next/navigation";

import BalDataContext from "@/contexts/bal-data";

import {
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  Toponyme,
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

  const onFusionVoie = useCallback(async () => {
    setOnFusionLoading(true);
    const convertToponyme = toaster(
      async () => {
        const toponyme: Toponyme = await VoiesService.convertToToponyme(
          toFusion.id
        );
        await reloadVoies();
        await reloadToponymes();
        await reloadParcelles();
        reloadTiles();
        refreshBALSync();
        // RELOAD ALERTS
        reloadVoieAlerts(toFusion);
        await router.push(
          `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${toponyme.id}`
        );
      },
      "La voie a bien été convertie en toponyme",
      "La voie n’a pas pu être convertie en toponyme"
    );

    await convertToponyme();
    matomoTrackEvent(
      MatomoEventCategory.QUALITY,
      MatomoEventAction[MatomoEventCategory.QUALITY].CONVERT_VOIE_TO_TOPONYME
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
            Êtes vous bien sûr de vouloir fusionner les {"3"} voies avec le nom{" "}
            {"place de léglise"}
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
