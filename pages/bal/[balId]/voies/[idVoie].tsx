import React, { useEffect, useContext } from "react";
import { Pane } from "evergreen-ui";

import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";

import useHelp from "@/hooks/help";
import useFormState from "@/hooks/useFormState";

import NumeroEditor from "@/components/bal/numero-editor";
import VoieHeading from "@/components/voie/voie-heading";
import NumerosList from "@/components/voie/numeros-list";
import { CommuneType } from "@/types/commune";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import {
  ExtendedVoieDTO,
  Numero,
  OpenAPI,
  VoieMetas,
  VoiesService,
} from "@/lib/openapi-api-bal";
// Import BALRecoveryContext from '@/contexts/bal-recovery'

interface VoiePageProps {
  commune: CommuneType;
}

function VoiePage({ commune }: VoiePageProps) {
  const { isFormOpen, handleEditing, editedNumero, reset } = useFormState();

  useHelp(3);

  const { token } = useContext(TokenContext);
  const { voie, setVoie, numeros, reloadNumeros } = useContext(BalDataContext);

  useEffect(() => {
    async function addCommentsToVoies() {
      try {
        const voieMetas: VoieMetas = await VoiesService.findVoieMetas(voie.id);
        setVoie({ ...voie, ...voieMetas });
      } catch (e) {
        console.error("Impossible de charger les commentaires de voie", e);
      }
    }

    if (token) {
      addCommentsToVoies();
      reloadNumeros();
    }
  }, [token]);

  return (
    <>
      <VoieHeading voie={voie} />

      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {isFormOpen && (
          <NumeroEditor
            hasPreview
            initialVoieId={voie.id}
            initialValue={editedNumero}
            commune={commune}
            closeForm={reset}
          />
        )}

        <NumerosList
          token={token}
          voieId={voie.id}
          numeros={numeros}
          handleEditing={handleEditing}
        />
      </Pane>
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  const { idVoie, balId }: { idVoie: string; balId: string } = params;

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);
    const voie: ExtendedVoieDTO = await VoiesService.findVoie(idVoie);
    const numeros: Numero[] = await VoiesService.findVoieNumeros(idVoie);

    return {
      props: {
        baseLocale,
        commune,
        voies,
        toponymes,
        voie,
        numeros,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default VoiePage;
