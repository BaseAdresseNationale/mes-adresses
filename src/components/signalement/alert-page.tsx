"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, Pane, Text } from "evergreen-ui";
import NextLink from "next/link";
import { Alert } from "@/lib/openapi-signalement";
import { Signalement } from "@/lib/openapi-signalement";
import {
  SignalementsService as SignalementsServiceBal,
  UpdateOneReportDTO,
} from "@/lib/openapi-api-bal";
import { useRouter } from "next/navigation";
import LayoutContext from "@/contexts/layout";
import { getSignalementLabel } from "@/lib/utils/signalement";
import MapContext from "@/contexts/map";
import BalDataContext from "@/contexts/bal-data";
import ProtectedPage from "@/layouts/protected-page";
import SignalementContext from "@/contexts/signalement";
import TokenContext from "@/contexts/token";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { TilesLayerMode } from "@/components/map/layers/tiles";
import { wait } from "@/lib/utils/promise";
import { AlertForm } from "@/components/signalement/alert-form/alert-form";
import { AlertViewer } from "@/components/signalement/alert-viewer/alert-viewer";

interface AlertPageProps {
  alert: Alert;
}

export default function AlertPage({ alert }: AlertPageProps) {
  const router = useRouter();
  const { fetchPendingSignalements, updateOneSignalement } =
    useContext(SignalementContext);
  const { toaster, setBreadcrumbs } = useContext(LayoutContext);
  const { setTileLayersMode } = useContext(MapContext);
  const { refreshBALSync, baseLocale } = useContext(BalDataContext);
  const [author, setAuthor] = useState<Signalement["author"]>();
  const { token } = useContext(TokenContext);

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.HIDDEN);
    setBreadcrumbs(
      <>
        <Link is={NextLink} href={`/bal/${baseLocale.id}/signalements`}>
          Signalements
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text aria-current="page">{getSignalementLabel(alert)}</Text>
      </>
    );

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, baseLocale, alert, setTileLayersMode]);

  useEffect(() => {
    const fetchAuthor = async () => {
      const report = await SignalementsServiceBal.getReport(
        alert.id,
        baseLocale.id
      );
      setAuthor(report.author);
    };

    if (token) {
      fetchAuthor();
    }
  }, [alert, baseLocale, token]);

  const handleClose = useCallback(() => {
    router.push(`/bal/${baseLocale.id}/${TabsEnum.SIGNALEMENTS}`);
  }, [router, baseLocale]);

  const getNextSignalement = useCallback(async () => {
    const signalements = await fetchPendingSignalements(1);
    return signalements[0];
  }, [fetchPendingSignalements]);

  const handleSubmit = useCallback(
    async (
      status: Signalement.status,
      reportDTO?: Omit<UpdateOneReportDTO, "status">
    ) => {
      const _updateSignalement = toaster(
        async () => {
          await updateOneSignalement(alert.id, {
            status,
            ...reportDTO,
          });
          await refreshBALSync();
        },
        status === Signalement.status.PROCESSED
          ? "Le signalement a bien été pris en compte"
          : "Le signalement a bien été ignoré",
        "Une erreur est survenue"
      );

      await _updateSignalement();

      const nextSignalement = await getNextSignalement();

      await wait(1000);

      if (nextSignalement) {
        router.push(
          `/bal/${baseLocale.id}/${TabsEnum.SIGNALEMENTS}/${nextSignalement.id}`
        );
      } else {
        handleClose();
      }
    },
    [
      alert,
      toaster,
      handleClose,
      getNextSignalement,
      router,
      refreshBALSync,
      updateOneSignalement,
      baseLocale,
    ]
  );

  return (
    <ProtectedPage>
      <Pane overflow="scroll" height="100%">
        {alert.status === Alert.status.IGNORED ||
        alert.status === Alert.status.PROCESSED ? (
          <AlertViewer alert={alert} author={author} onClose={handleClose} />
        ) : (
          <AlertForm
            alert={alert}
            author={author}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        )}
      </Pane>
    </ProtectedPage>
  );
}
