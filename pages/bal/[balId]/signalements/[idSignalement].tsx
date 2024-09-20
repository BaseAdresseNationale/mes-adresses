import React, { useContext, useMemo, useState } from "react";
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
  ExistingNumero,
  ExistingToponyme,
  ExistingVoie,
  NumeroChangesRequestedDTO,
  Signalement,
  SignalementsService,
} from "@/lib/openapi-signalement";
import { useRouter } from "next/router";
import SignalementUpdateNumero from "@/components/signalement/numero/signalement-update-numero";
import SignalementViewer from "@/components/signalement/signalement-viewer";
import SignalementDeleteNumero from "@/components/signalement/numero/signalement-delete-numero";
import SignalementCreateNumero from "@/components/signalement/numero/signalement-create-numero";
import SignalementUpdateVoie from "@/components/signalement/voie/signalement-update-voie";
import SignalementUpdateToponyme from "@/components/signalement/toponyme/signalement-update-toponyme";
import LayoutContext from "@/contexts/layout";
import { updateSignalement } from "@/lib/utils/signalement";

interface SignalementPageProps extends BaseEditorProps {
  signalement: Signalement;
  existingLocation: Voie | Toponyme | Numero | null;
}

function SignalementPage({
  signalement,
  existingLocation,
  commune,
}: SignalementPageProps) {
  const [activeTab, setActiveTab] = useState(
    signalement.type === Signalement.type.OTHER ? 0 : 1
  );
  const router = useRouter();
  const { toaster } = useContext(LayoutContext);

  const handleClose = () => {
    router.push(`/bal/${router.query.balId}/signalements`);
  };

  const handleSignalementProcessed = async () => {
    const _updateSignalement = toaster(
      () => updateSignalement(signalement.id, Signalement.status.PROCESSED),
      "Le signalement a bien été pris en compte",
      "Une erreur est survenue"
    );

    await _updateSignalement();
    handleClose();
  };

  const tabs = useMemo(() => {
    if (signalement.type === Signalement.type.OTHER) {
      return ["Infos"];
    }

    return ["Infos", "Editeur"];
  }, [signalement]);

  return (
    <ProtectedPage>
      {existingLocation ? (
        <>
          <Tablist margin={10}>
            {tabs.map((tab, index) => (
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
                signalement={signalement}
                existingLocation={existingLocation}
              />
            )}
            {activeTab === 1 && (
              <>
                {signalement.type === Signalement.type.LOCATION_TO_CREATE && (
                  <SignalementCreateNumero
                    signalement={signalement}
                    initialVoieId={existingLocation.id}
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

async function getExistingLocation(
  signalement: Signalement,
  voies: Voie[],
  toponymes: Toponyme[]
) {
  let existingLocation = null;
  if (signalement.existingLocation.type === ExistingLocation.type.VOIE) {
    existingLocation = voies.find(
      (voie) => voie.nom === (signalement.existingLocation as ExistingVoie).nom
    );
  } else if (
    signalement.existingLocation.type === ExistingLocation.type.TOPONYME
  ) {
    existingLocation = toponymes.find(
      (toponyme) =>
        toponyme.nom === (signalement.existingLocation as ExistingToponyme).nom
    );
  } else if (
    signalement.existingLocation.type === ExistingLocation.type.NUMERO
  ) {
    const existingNumero = signalement.existingLocation as ExistingNumero;
    if (existingNumero.toponyme.type === ExistingLocation.type.VOIE) {
      const voie = voies.find(
        (voie) => voie.nom === existingNumero.toponyme.nom
      );
      const numeros = await VoiesService.findVoieNumeros(voie.id);
      existingLocation = numeros.find(({ numero, suffixe }) => {
        const existingLocationNumeroComplet = existingNumero.suffixe
          ? `${existingNumero.numero}${existingNumero.suffixe}`
          : `${existingNumero.numero}`;
        const numeroComplet = suffixe ? `${numero}${suffixe}` : `${numero}`;
        return numeroComplet === existingLocationNumeroComplet;
      });
      if (existingLocation) {
        existingLocation.voie = voie;
      }
    } else {
      const toponyme = toponymes.find(
        (toponyme) => toponyme.nom === existingNumero.toponyme.nom
      );
      const numeros = await ToponymesService.findToponymeNumeros(toponyme.id);
      existingLocation = numeros.find(({ numero, suffixe }) => {
        const existingLocationNumeroComplet = existingNumero.suffixe
          ? `${existingNumero.numero}${existingNumero.suffixe}`
          : `${existingNumero.numero}`;
        const numeroComplet = suffixe ? `${numero}${suffixe}` : `${numero}`;
        return numeroComplet === existingLocationNumeroComplet;
      });
      if (existingLocation) {
        existingLocation.toponyme = toponyme;
      }
    }
  }

  return existingLocation;
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);

    const signalement = await SignalementsService.getSignalementById(
      params.idSignalement
    );

    if ((signalement.changesRequested as NumeroChangesRequestedDTO).positions) {
      (signalement.changesRequested as NumeroChangesRequestedDTO).positions = (
        signalement.changesRequested as NumeroChangesRequestedDTO
      ).positions.map((p) => ({
        ...p,
        _id: uniqueId(),
        source: "signalement",
      }));
    }

    let existingLocation = null;
    if (
      signalement.type === Signalement.type.LOCATION_TO_UPDATE ||
      signalement.type === Signalement.type.LOCATION_TO_DELETE ||
      signalement.type === Signalement.type.OTHER
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
      existingLocation = voies.find(
        (voie) =>
          voie.nom === (signalement.existingLocation as ExistingVoie).nom
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
