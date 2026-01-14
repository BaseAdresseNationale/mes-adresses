"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Link, Pane, Paragraph, Text } from "evergreen-ui";
import NextLink from "next/link";
import { Numero, Toponyme, Voie } from "@/lib/openapi-api-bal";
import { Signalement } from "@/lib/openapi-signalement";
import { SignalementsService as SignalementsServiceBal } from "@/lib/openapi-api-bal";
import { useRouter } from "next/navigation";
import LayoutContext from "@/contexts/layout";
import { getSignalementLabel } from "@/lib/utils/signalement";
import MapContext from "@/contexts/map";
import BalDataContext from "@/contexts/bal-data";
import ProtectedPage from "@/layouts/protected-page";
import SignalementForm from "@/components/signalement/signalement-form/signalement-form";
import { SignalementViewer } from "@/components/signalement/signalement-viewer/signalement-viewer";
import SignalementContext from "@/contexts/signalement";
import TokenContext from "@/contexts/token";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { TilesLayerMode } from "@/components/map/layers/tiles";

interface SignalementPageProps {
  signalement: Signalement;
  existingLocation: Voie | Toponyme | Numero | null;
  requestedLocations: { toponyme?: Toponyme | null; voie?: Voie | null };
}

export default function SignalementPage({
  signalement,
  existingLocation,
  requestedLocations,
}: SignalementPageProps) {
  const router = useRouter();
  const { fetchPendingSignalements, updateOneSignalement } =
    useContext(SignalementContext);
  const { toaster, setBreadcrumbs } = useContext(LayoutContext);
  const { setTileLayersMode } = useContext(MapContext);
  const { refreshBALSync, baseLocale } = useContext(BalDataContext);
  const [author, setAuthor] = useState<Signalement["author"]>();
  const { token } = useContext(TokenContext);

  const isNewVoieCreation =
    signalement.type === Signalement.type.LOCATION_TO_CREATE &&
    signalement.existingLocation === null;

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.HIDDEN);
    setBreadcrumbs(
      <>
        <Link is={NextLink} href={`/bal/${baseLocale.id}/signalements`}>
          Signalements
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text aria-current="page">{getSignalementLabel(signalement)}</Text>
      </>
    );

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, baseLocale, signalement, setTileLayersMode]);

  // Mark the signalement as expired if the location is not found
  // and the signalement is still pending
  useEffect(() => {
    const markSignalementAsExpired = async () => {
      await SignalementsServiceBal.updateSignalements(baseLocale.id, {
        ids: [signalement.id],
        status: Signalement.status.EXPIRED,
      });
    };

    if (
      (existingLocation === null ||
        requestedLocations.toponyme === null ||
        requestedLocations.voie === null) &&
      signalement.status === Signalement.status.PENDING &&
      !isNewVoieCreation
    ) {
      markSignalementAsExpired();
    }
  }, [
    existingLocation,
    signalement,
    baseLocale,
    requestedLocations,
    isNewVoieCreation,
  ]);

  // Fetch the author of the signalement
  useEffect(() => {
    const fetchAuthor = async () => {
      const author = await SignalementsServiceBal.getAuthor(
        signalement.id,
        baseLocale.id
      );
      setAuthor(author);
    };

    if (token) {
      fetchAuthor();
    }
  }, [signalement, baseLocale, token]);

  const handleClose = useCallback(() => {
    router.push(`/bal/${baseLocale.id}/${TabsEnum.SIGNALEMENTS}`);
  }, [router, baseLocale]);

  const getNextSignalement = useCallback(async () => {
    const signalements = await fetchPendingSignalements(1);

    return signalements[0];
  }, [fetchPendingSignalements]);

  const handleSubmit = useCallback(
    async (status: Signalement.status, reason?: string) => {
      const _updateSignalement = toaster(
        async () => {
          await updateOneSignalement(signalement.id, status, reason);
          await refreshBALSync();
        },
        status === Signalement.status.PROCESSED
          ? "Le signalement a bien été pris en compte"
          : "Le signalement a bien été ignoré",
        "Une erreur est survenue"
      );

      await _updateSignalement();

      const nextSignalement = await getNextSignalement();

      if (nextSignalement) {
        router.push(
          `/bal/${baseLocale.id}/${TabsEnum.SIGNALEMENTS}/${nextSignalement.id}`
        );
      } else {
        handleClose();
      }
    },
    [
      signalement,
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
      {signalement.status === Signalement.status.IGNORED ||
      signalement.status === Signalement.status.PROCESSED ? (
        <SignalementViewer
          signalement={signalement}
          author={author}
          onClose={() =>
            router.push(
              `/bal/${baseLocale.id}/${TabsEnum.SIGNALEMENTS}?tab=archived`
            )
          }
        />
      ) : signalement.status === Signalement.status.PENDING &&
        (existingLocation || isNewVoieCreation) &&
        requestedLocations.toponyme !== null &&
        requestedLocations.voie !== null ? (
        <Pane overflow="scroll" height="100%">
          <SignalementForm
            signalement={signalement}
            author={author}
            existingLocation={existingLocation}
            requestedLocations={requestedLocations}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </Pane>
      ) : (
        <Pane padding={20}>
          <Paragraph>
            Impossible de trouver la localisation du signalement.
          </Paragraph>
          <Paragraph>
            Il a été marqué comme expiré et n&apos;apparaîtra plus dans la liste
            des signalements.
          </Paragraph>
          <Button
            is={NextLink}
            href={`/bal/${baseLocale.id}/signalements`}
            marginTop="1rem"
            type="button"
            width="fit-content"
            alignSelf="center"
            appearance="primary"
          >
            Retour à la liste des signalements
          </Button>
        </Pane>
      )}
    </ProtectedPage>
  );
}
