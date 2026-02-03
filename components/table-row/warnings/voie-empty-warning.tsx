import { useCallback, useContext, useState } from "react";
import { Paragraph, Pane, Text, Button, WarningSignIcon } from "evergreen-ui";
import { useRouter } from "next/router";

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
import { AlertCodeEnum } from "@/lib/alerts/alerts.types";
import AlertsContext from "@/contexts/alerts";

interface VoieEmptyWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
}

function VoieEmptyWarning({ baseLocale, voie }: VoieEmptyWarningProps) {
  const { reloadVoies, reloadToponymes, reloadParcelles, refreshBALSync } =
    useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);
  const { reloadVoieAlerts } = useContext(AlertsContext);
  const [toConvert, setToConvert] = useState<ExtendedVoieDTO | null>(null);
  const [onConvertLoading, setOnConvertLoading] = useState<boolean>(false);
  const { toaster } = useContext(LayoutContext);
  const router = useRouter();

  const onConvert = useCallback(async () => {
    setOnConvertLoading(true);
    const convertToponyme = toaster(
      async () => {
        const toponyme: Toponyme = await VoiesService.convertToToponyme(
          toConvert.id,
        );
        await reloadVoies();
        await reloadToponymes();
        await reloadParcelles();
        reloadTiles();
        refreshBALSync();
        reloadVoieAlerts(
          toConvert,
          (baseLocale.settings?.ignoredAlertCodes as AlertCodeEnum[]) || [],
        );
        await router.push(
          `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${toponyme.id}`,
        );
      },
      "La voie a bien été convertie en toponyme",
      "La voie n’a pas pu être convertie en toponyme",
    );

    await convertToponyme();
    matomoTrackEvent(
      MatomoEventCategory.BAL_EDITOR,
      MatomoEventAction[MatomoEventCategory.BAL_EDITOR]
        .CONVERT_VOIE_TO_TOPONYME,
    );

    setOnConvertLoading(false);
    setToConvert(null);
  }, [
    toaster,
    matomoTrackEvent,
    toConvert,
    reloadVoies,
    reloadToponymes,
    reloadParcelles,
    reloadTiles,
    refreshBALSync,
    reloadVoieAlerts,
    baseLocale.settings?.ignoredAlertCodes,
    baseLocale.id,
    router,
  ]);

  return (
    <>
      <DialogWarningAction
        confirmLabel="Convertir en voie sans adresses"
        isShown={Boolean(toConvert)}
        content={
          <Paragraph>
            Êtes vous bien sûr de vouloir convertir cette voie en voie sans
            adresses ?
          </Paragraph>
        }
        isLoading={onConvertLoading}
        onCancel={() => {
          setToConvert(null);
        }}
        onConfirm={onConvert}
      />
      <>
        <Pane marginBottom={8}>
          <WarningSignIcon
            color="white"
            style={{ verticalAlign: "middle" }}
            marginRight={4}
          />
          <Text color="white">Cette voie ne contient aucun numéro</Text>
        </Pane>
        <Button
          onClick={() => setToConvert(voie)}
          size="small"
          title="Convertir la voie en voie sans adresses"
        >
          Convertir en voie sans adresses
        </Button>
      </>
    </>
  );
}

export default VoieEmptyWarning;
