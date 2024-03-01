import React, { useContext, useEffect } from "react";
import { Pane } from "evergreen-ui";

import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import SignalementViewer from "@/components/signalement/signalement-viewer";
import ProtectedPage from "@/layouts/protected-page";
import {
  SignalementService,
  ToponymesService,
  VoiesService,
} from "@/lib/openapi";
import NumeroEditor from "@/components/bal/numero-editor";
import MapContext from "@/contexts/map";
import { useRouter } from "next/router";

function SignalementPage({ signalement, existingLocation, commune }) {
  const { viewport, setViewport } = useContext(MapContext);
  const router = useRouter();
  useEffect(() => {
    const firstPosition = existingLocation?.positions?.[0];

    if (firstPosition) {
      setViewport({
        ...viewport,
        longitude: firstPosition.point.coordinates[0],
        latitude: firstPosition.point.coordinates[1],
        zoom: 18,
      });
    }
  }, []);

  const handleSignalementProcessed = async () => {
    await SignalementService.updateSignalement({ id: signalement._id });
    router.push(`/bal/${router.query.balId}/signalements`);
  };

  return (
    <ProtectedPage>
      <Pane
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="scroll"
      >
        <SignalementViewer signalement={signalement} />
        <Pane position="relative" height="100%">
          <NumeroEditor
            hasPreview
            initialValue={existingLocation}
            initialVoieId={existingLocation.voie?._id}
            commune={commune}
            closeForm={handleSignalementProcessed}
          />
        </Pane>
      </Pane>
    </ProtectedPage>
  );
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);

    const signalements = await SignalementService.getSignalements(
      baseLocale.commune
    );

    const signalement = signalements.find(
      (signalement) => signalement._id === params.idSignalement
    );

    let existingLocation = null;
    if (signalement.type === "LOCATION_TO_UPDATE") {
      if (signalement.existingLocation.type === "VOIE") {
        existingLocation = voies.find(
          (voie) => voie._id === signalement.existingLocation.nom
        );
      } else if (signalement.existingLocation.type === "TOPONYME") {
        existingLocation = toponymes.find(
          (toponyme) => toponyme._id === signalement.existingLocation.nom
        );
      } else if (signalement.existingLocation.type === "NUMERO") {
        const existingToponyme =
          signalement.existingLocation.toponyme.type === "VOIE"
            ? voies.find(
                (voie) => voie.nom === signalement.existingLocation.toponyme.nom
              )
            : toponymes.find(
                (toponyme) =>
                  toponyme.nom === signalement.existingLocation.toponyme.nom
              );

        if (signalement.existingLocation.toponyme.type === "VOIE") {
          const voie = voies.find(
            (voie) => voie.nom === signalement.existingLocation.toponyme.nom
          );
          const numeros = await VoiesService.findVoieNumeros(voie._id);
          existingLocation = numeros.find(({ numeroComplet }) => {
            const existingLocationNumeroComplet = signalement.existingLocation
              .suffixe
              ? `${signalement.existingLocation.numero}${signalement.existingLocation.suffixe}`
              : `${signalement.existingLocation.numero}`;
            return numeroComplet === existingLocationNumeroComplet;
          });
          existingLocation.voie = voie;
        } else {
          const toponyme = toponymes.find(
            (toponyme) =>
              toponyme.nom === signalement.existingLocation.toponyme.nom
          );
          const numeros = await ToponymesService.findToponymeNumeros(
            toponyme._id
          );
          existingLocation = numeros.find(({ numeroComplet }) => {
            const existingLocationNumeroComplet = signalement.existingLocation
              .suffixe
              ? `${signalement.existingLocation.numero}${signalement.existingLocation.suffixe}`
              : `${signalement.existingLocation.numero}`;
            return numeroComplet === existingLocationNumeroComplet;
          });
          existingLocation.toponyme = toponyme;
        }
      }
    }

    return {
      props: {
        baseLocale,
        commune,
        voies,
        toponymes,
        signalement,
        existingLocation,
      },
    };
  } catch {
    return {
      error: {
        statusCode: 404,
      },
    };
  }
}

export default SignalementPage;
