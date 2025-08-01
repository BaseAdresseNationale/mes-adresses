import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Link, Pane, Paragraph, Text } from "evergreen-ui";
import NextLink from "next/link";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  Numero,
  Toponyme,
  Voie,
} from "@/lib/openapi-api-bal";
import {
  ExistingVoie,
  NumeroChangesRequestedDTO,
  Signalement,
  SignalementsService,
} from "@/lib/openapi-signalement";
import { SignalementsService as SignalementsServiceBal } from "@/lib/openapi-api-bal";
import { useRouter } from "next/router";
import LayoutContext from "@/contexts/layout";
import {
  getExistingLocation,
  getSignalementLabel,
} from "@/lib/utils/signalement";
import { ObjectId } from "bson";
import MapContext, { defaultStyle } from "@/contexts/map";
import BalDataContext from "@/contexts/bal-data";
import ProtectedPage from "@/layouts/protected-page";
import SignalementForm from "@/components/signalement/signalement-form/signalement-form";
import { SignalementViewer } from "@/components/signalement/signalement-viewer/signalement-viewer";
import SignalementContext from "@/contexts/signalement";
import TokenContext from "@/contexts/token";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";

interface SignalementPageProps {
  signalement: Signalement;
  existingLocation: Voie | Toponyme | Numero | null;
  requestedToponyme?: Toponyme;
  baseLocale: ExtendedBaseLocaleDTO;
}

function SignalementPage({
  signalement,
  existingLocation,
  requestedToponyme,
  baseLocale,
}: SignalementPageProps) {
  const router = useRouter();
  const { fetchPendingSignalements, updateOneSignalement } =
    useContext(SignalementContext);
  const { toaster, setBreadcrumbs } = useContext(LayoutContext);
  const { setStyle } = useContext(MapContext);
  const { refreshBALSync } = useContext(BalDataContext);
  const [author, setAuthor] = useState<Signalement["author"]>();
  const { token } = useContext(TokenContext);

  const isNewVoieCreation =
    signalement.type === Signalement.type.LOCATION_TO_CREATE &&
    signalement.existingLocation === null;

  useEffect(() => {
    setStyle("ortho");
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
      setStyle(defaultStyle);
      setBreadcrumbs(null);
    };
  }, [setStyle, setBreadcrumbs, baseLocale, signalement]);

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
      (existingLocation === null || requestedToponyme === null) &&
      signalement.status === Signalement.status.PENDING &&
      !isNewVoieCreation
    ) {
      markSignalementAsExpired();
    }
  }, [
    existingLocation,
    signalement,
    baseLocale,
    requestedToponyme,
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
    router.push(`/bal/${router.query.balId}/${TabsEnum.SIGNALEMENTS}`);
  }, [router]);

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
          `/bal/${router.query.balId}/${TabsEnum.SIGNALEMENTS}/${nextSignalement.id}`
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
              `/bal/${router.query.balId}/${TabsEnum.SIGNALEMENTS}?tab=archived`
            )
          }
        />
      ) : signalement.status === Signalement.status.PENDING &&
        (existingLocation || isNewVoieCreation) &&
        requestedToponyme !== null ? (
        <Pane overflow="scroll" height="100%">
          <SignalementForm
            signalement={signalement}
            author={author}
            existingLocation={existingLocation}
            requestedToponyme={requestedToponyme}
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
            href={`/bal/${router.query.balId}/signalements`}
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

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);

    const voies = await BasesLocalesService.findBaseLocaleVoies(balId);
    const toponymes = await BasesLocalesService.findBaseLocaleToponymes(balId);

    const signalement = await SignalementsService.getSignalementById(
      params.idSignalement
    );

    if ((signalement.changesRequested as NumeroChangesRequestedDTO).positions) {
      (signalement.changesRequested as NumeroChangesRequestedDTO).positions = (
        signalement.changesRequested as NumeroChangesRequestedDTO
      ).positions.map((p) => ({
        ...p,
        id: new ObjectId().toHexString(),
      }));
    }

    if (
      signalement.status === Signalement.status.PROCESSED ||
      signalement.status === Signalement.status.IGNORED
    ) {
      return {
        props: {
          baseLocale,
          voies,
          toponymes,
          signalement,
          existingLocation: null,
        },
      };
    }

    let requestedToponyme;
    if (
      (signalement.changesRequested as NumeroChangesRequestedDTO).nomComplement
    ) {
      requestedToponyme =
        toponymes.find(
          (toponyme) =>
            toponyme.nom ===
            (signalement.changesRequested as NumeroChangesRequestedDTO)
              .nomComplement
        ) || null;
    }

    let existingLocation = null;
    try {
      existingLocation = await getExistingLocation(
        signalement,
        voies,
        toponymes
      );
    } catch (err) {
      console.error(err);
      existingLocation = null;
    }

    if (!existingLocation) {
      existingLocation = null;
    }

    return {
      props: {
        baseLocale,
        voies,
        toponymes,
        signalement,
        existingLocation,
        ...(requestedToponyme !== undefined ? { requestedToponyme } : {}),
      },
    };
  } catch (err) {
    console.error(err);
    return {
      notFound: true,
    };
  }
}

export default SignalementPage;
