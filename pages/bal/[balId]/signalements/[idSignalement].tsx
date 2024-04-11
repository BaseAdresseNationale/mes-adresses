import React, { useState } from "react";
import { Heading, Pane, Paragraph, Tab, Tablist } from "evergreen-ui";
import { uniqueId } from "lodash";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import ProtectedPage from "@/layouts/protected-page";
import {
  Numero,
  Toponyme,
  ToponymesService,
  Voie,
  VoiesService,
} from "@/lib/openapi";
import {
  ExistingLocation,
  Signalement,
  DefaultService as SignalementService,
} from "@/lib/openapi-signalement";
import { useRouter } from "next/router";
import SignalementUpdateNumero from "@/components/signalement/numero/signalement-update-numero";
import SignalementViewer from "@/components/signalement/signalement-viewer";
import SignalementDeleteNumero from "@/components/signalement/numero/signalement-delete-numero";
import SignalementCreateNumero from "@/components/signalement/numero/signalement-create-numero";
import SignalementUpdateVoie from "@/components/signalement/voie/signalement-update-voie";
import SignalementUpdateToponyme from "@/components/signalement/toponyme/signalement-update-toponyme";

interface SignalementPageProps extends BaseEditorProps {
  signalement: Signalement;
  existingLocation: Voie | Toponyme | Numero | null;
}

function SignalementPage({
  signalement,
  existingLocation,
  commune,
}: SignalementPageProps) {
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();

  const handleClose = () => {
    router.push(`/bal/${router.query.balId}/signalements`);
  };

  const handleSignalementProcessed = async () => {
    await SignalementService.updateSignalement({
      id: signalement._id as string,
    });
    handleClose();
  };

  return (
    <ProtectedPage>
      {existingLocation ? (
        <>
          <Tablist margin={10}>
            {["Infos", "Editeur"].map((tab, index) => (
              <Tab
                key={tab}
                isSelected={activeTab === index}
                onSelect={() => setActiveTab(index)}
              >
                {tab}
              </Tab>
            ))}
          </Tablist>
          <Pane overflow="scroll" height="100%">
            {activeTab === 0 && (
              <SignalementViewer
                existingLocation={existingLocation}
                signalement={signalement}
              />
            )}
            {activeTab === 1 && (
              <>
                {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
                  <SignalementCreateNumero
                    signalement={signalement}
                    initialVoieId={existingLocation._id}
                    handleClose={handleClose}
                    commune={commune}
                    handleSubmit={handleSignalementProcessed}
                  />
                )}
                {signalement.type === Signalement.type.LOCATION_TO_UPDATE &&
                  (signalement.existingLocation.type ===
                  ExistingLocation.type.NUMERO ? (
                    <SignalementUpdateNumero
                      existingLocation={
                        existingLocation as Numero & { voie: Voie }
                      }
                      signalement={signalement}
                      handleSubmit={handleSignalementProcessed}
                      handleClose={handleClose}
                      commune={commune}
                    />
                  ) : signalement.existingLocation.type ===
                    ExistingLocation.type.VOIE ? (
                    <SignalementUpdateVoie
                      existingLocation={existingLocation as Voie}
                      signalement={signalement}
                      handleSubmit={handleSignalementProcessed}
                      handleClose={handleClose}
                      commune={commune}
                    />
                  ) : (
                    <SignalementUpdateToponyme
                      existingLocation={existingLocation as Toponyme}
                      signalement={signalement}
                      handleSubmit={handleSignalementProcessed}
                      handleClose={handleClose}
                      commune={commune}
                    />
                  ))}
                {signalement.type === Signalement.type.LOCATION_TO_DELETE && (
                  <SignalementDeleteNumero
                    existingLocation={
                      existingLocation as Numero & { voie: Voie }
                    }
                    handleClose={handleClose}
                    commune={commune}
                    handleSubmit={handleSignalementProcessed}
                  />
                )}
              </>
            )}
          </Pane>
        </>
      ) : (
        <Pane padding={20}>
          <Heading>Erreur :</Heading>
          <Paragraph>
            Impossible de trouver la localisation du signalement.
          </Paragraph>
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

    const signalements = await SignalementService.getSignalementsByCodeCommune(
      baseLocale.commune
    );

    const signalement = signalements.find(
      (signalement) => signalement._id === params.idSignalement
    );

    if (signalement.changesRequested.positions) {
      signalement.changesRequested.positions =
        signalement.changesRequested.positions.map((p) => ({
          ...p,
          _id: uniqueId(),
          source: "signalement",
        }));
    }

    let existingLocation = null;
    if (
      signalement.type === Signalement.type.LOCATION_TO_UPDATE ||
      signalement.type === Signalement.type.LOCATION_TO_DELETE
    ) {
      if (signalement.existingLocation.type === ExistingLocation.type.VOIE) {
        existingLocation = voies.find(
          (voie) => voie.nom === signalement.existingLocation.nom
        );
      } else if (
        signalement.existingLocation.type === ExistingLocation.type.TOPONYME
      ) {
        existingLocation = toponymes.find(
          (toponyme) => toponyme.nom === signalement.existingLocation.nom
        );
      } else if (
        signalement.existingLocation.type === ExistingLocation.type.NUMERO
      ) {
        if (
          signalement.existingLocation.toponyme.type ===
          ExistingLocation.type.VOIE
        ) {
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
          if (existingLocation) {
            existingLocation.voie = voie;
          }
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
          if (existingLocation) {
            existingLocation.toponyme = toponyme;
          }
        }
      }
    } else if (signalement.type === Signalement.type.LOCATION_TO_CREATE) {
      existingLocation = voies.find(
        (voie) => voie.nom === signalement.existingLocation.nom
      );
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
