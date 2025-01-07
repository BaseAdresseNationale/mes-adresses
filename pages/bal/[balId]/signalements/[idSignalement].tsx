import React, { useCallback, useContext, useEffect } from "react";
import { Button, Link, Pane, Paragraph, Text } from "evergreen-ui";
import NextLink from "next/link";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import { Numero, Toponyme, Voie } from "@/lib/openapi-api-bal";
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
import { CommuneType } from "@/types/commune";
import { ObjectId } from "bson";
import MapContext, { defaultStyle } from "@/contexts/map";
import BalDataContext from "@/contexts/bal-data";
import ProtectedPage from "@/layouts/protected-page";
import SignalementForm from "@/components/signalement/signalement-form/signalement-form";
import { SignalementViewer } from "@/components/signalement/signalement-viewer/signalement-viewer";
import SignalementContext from "@/contexts/signalement";

interface SignalementPageProps extends BaseEditorProps {
  signalement: Signalement;
  existingLocation: Voie | Toponyme | Numero | null;
  requestedToponyme?: Toponyme;
  commune: CommuneType;
}

function SignalementPage({
  signalement,
  existingLocation,
  requestedToponyme,
  commune,
  baseLocale,
}: SignalementPageProps) {
  const router = useRouter();
  const { fetchPendingSignalements, updateSignalements } =
    useContext(SignalementContext);
  const { toaster, setBreadcrumbs } = useContext(LayoutContext);
  const { setStyle } = useContext(MapContext);
  const { refreshBALSync } = useContext(BalDataContext);

  useEffect(() => {
    setStyle("ortho");
    setBreadcrumbs(
      <>
        <Link is={NextLink} href={`/bal/${baseLocale.id}`}>
          {baseLocale.nom || commune.nom}
        </Link>

        <Text color="muted">{" > "}</Text>
        <Link is={NextLink} href={`/bal/${baseLocale.id}/signalements`}>
          Signalements
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text>{getSignalementLabel(signalement)}</Text>
      </>
    );

    return () => {
      setStyle(defaultStyle);
      setBreadcrumbs(null);
    };
  }, [setStyle, setBreadcrumbs, baseLocale, signalement, commune]);

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
      signalement.status === Signalement.status.PENDING
    ) {
      markSignalementAsExpired();
    }
  }, [existingLocation, signalement, baseLocale, requestedToponyme]);

  const handleClose = useCallback(() => {
    router.push(`/bal/${router.query.balId}/signalements`);
  }, [router]);

  const getNextSignalement = useCallback(async () => {
    const signalements = await fetchPendingSignalements(1);

    return signalements[0];
  }, [fetchPendingSignalements]);

  const handleSubmit = useCallback(
    async (status: Signalement.status) => {
      const _updateSignalement = toaster(
        async () => {
          await updateSignalements([signalement.id], status);
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
          `/bal/${router.query.balId}/signalements/${nextSignalement.id}`
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
      updateSignalements,
    ]
  );

  return (
    <ProtectedPage>
      {existingLocation && requestedToponyme !== null ? (
        <Pane overflow="scroll" height="100%">
          <SignalementForm
            signalement={signalement}
            baseLocale={baseLocale}
            existingLocation={existingLocation}
            requestedToponyme={requestedToponyme}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </Pane>
      ) : signalement.status === Signalement.status.IGNORED ||
        signalement.status === Signalement.status.PROCESSED ? (
        <SignalementViewer
          baseLocale={baseLocale}
          signalement={signalement}
          onClose={() =>
            router.push(`/bal/${router.query.balId}/signalements?tab=archived`)
          }
        />
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
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);

    const signalement = await SignalementsService.getSignalementById(
      params.idSignalement
    );

    if (
      signalement.status === Signalement.status.PROCESSED ||
      signalement.status === Signalement.status.IGNORED
    ) {
      return {
        props: {
          baseLocale,
          commune,
          voies,
          toponymes,
          signalement,
          existingLocation: null,
        },
      };
    }

    if ((signalement.changesRequested as NumeroChangesRequestedDTO).positions) {
      (signalement.changesRequested as NumeroChangesRequestedDTO).positions = (
        signalement.changesRequested as NumeroChangesRequestedDTO
      ).positions.map((p) => ({
        ...p,
        id: new ObjectId().toHexString(),
      }));
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
    if (
      signalement.type === Signalement.type.LOCATION_TO_UPDATE ||
      signalement.type === Signalement.type.LOCATION_TO_DELETE
    ) {
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
    } else if (signalement.type === Signalement.type.LOCATION_TO_CREATE) {
      existingLocation = voies.find((voie) => {
        if ((signalement.existingLocation as ExistingVoie).banId) {
          return (
            voie.banId ===
              (signalement.existingLocation as ExistingVoie).banId ||
            voie.nom === (signalement.existingLocation as ExistingVoie).nom
          );
        }

        return voie.nom === (signalement.existingLocation as ExistingVoie).nom;
      });
    }

    if (!existingLocation) {
      existingLocation = null;
    }

    return {
      props: {
        baseLocale,
        commune,
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
