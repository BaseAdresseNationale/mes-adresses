import { useCallback, useContext, useState } from "react";
import { Paragraph, Pane, Text, Button, WarningSignIcon } from "evergreen-ui";
import NextLink from "next/link";
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
import { Alert, AlertDefinitions } from "@/lib/alerts/alerts.types";

interface TableRowWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
  alert: Alert;
}

function TableRowWarning({ baseLocale, voie, alert }: TableRowWarningProps) {
  const { reloadVoies, reloadToponymes, reloadParcelles, refreshBALSync } =
    useContext(BalDataContext);
  const { reloadTiles } = useContext(MapContext);
  const { matomoTrackEvent } = useContext(MatomoTrackingContext);

  const [toConvert, setToConvert] = useState<string | null>(null);
  const [onConvertLoading, setOnConvertLoading] = useState<boolean>(false);
  const { toaster } = useContext(LayoutContext);
  const router = useRouter();

  const onConvert = useCallback(async () => {
    setOnConvertLoading(true);
    const convertToponyme = toaster(
      async () => {
        const toponyme: Toponyme =
          await VoiesService.convertToToponyme(toConvert);
        await reloadVoies();
        await reloadToponymes();
        await reloadParcelles();
        reloadTiles();
        refreshBALSync();
        await router.push(
          `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${toponyme.id}`
        );
      },
      "La voie a bien été convertie en toponyme",
      "La voie n’a pas pu être convertie en toponyme"
    );

    await convertToponyme();
    matomoTrackEvent(
      MatomoEventCategory.BAL_EDITOR,
      MatomoEventAction[MatomoEventCategory.BAL_EDITOR].CONVERT_VOIE_TO_TOPONYME
    );

    setOnConvertLoading(false);
    setToConvert(null);
  }, [
    baseLocale,
    router,
    reloadVoies,
    refreshBALSync,
    reloadToponymes,
    reloadTiles,
    reloadParcelles,
    toConvert,
    toaster,
    matomoTrackEvent,
  ]);
  return (
    <>
      <DialogWarningAction
        confirmLabel="Convertir en toponyme"
        isShown={Boolean(toConvert)}
        content={
          <Paragraph>
            Êtes vous bien sûr de vouloir convertir cette voie en toponyme ?
          </Paragraph>
        }
        isLoading={onConvertLoading}
        onCancel={() => {
          setToConvert(null);
        }}
        onConfirm={onConvert}
      />

      {voie.nbNumeros === 0 ? (
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
            onClick={() => setToConvert(voie.id)}
            size="small"
            title="Convertir la voie en toponyme"
          >
            Convertir en toponyme
          </Button>
        </>
      ) : null}
      {alert && (
        <>
          <Pane marginTop={8} marginBottom={8}>
            <hr />
            <Text color="white">
              <WarningSignIcon
                color="white"
                style={{ verticalAlign: "middle" }}
                marginRight={4}
              />
              Problème avec le nom de la voie :
              {alert.codes.map((code) => (
                <>
                  <br />
                  {AlertDefinitions[code].message}
                </>
              ))}
            </Text>
          </Pane>
          <Button
            is={NextLink}
            href={`/bal/${baseLocale.id}/${TabsEnum.VOIES}/${voie.id}`}
            title="Éditer la voie"
            size="small"
          >
            Corriger le nom de la voie
          </Button>
        </>
      )}
    </>
  );
}

export default TableRowWarning;
