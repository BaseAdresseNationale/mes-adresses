import {
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  VoiesService,
} from "@/lib/openapi-api-bal";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import VoieEditor from "@/components/bal/voie-editor";
import ProtectedPage from "@/layouts/protected-page";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import LayoutContext from "@/contexts/layout";
import NextLink from "next/link";
import { Text, Link } from "evergreen-ui";

interface VoiePageProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
}

function VoiePage({ baseLocale, voie }: VoiePageProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);

  useEffect(() => {
    setBreadcrumbs(
      <>
        <Link is={NextLink} href={`/bal/${baseLocale.id}/${TabsEnum.VOIES}`}>
          Voies
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text>{voie.nom}</Text>
      </>
    );

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, baseLocale.id, voie.nom]);

  return (
    <ProtectedPage>
      <VoieEditor
        initialValue={voie}
        closeForm={() => {
          router.push(`/bal/${baseLocale.id}/${TabsEnum.VOIES}`);
        }}
      />
    </ProtectedPage>
  );
}

export async function getServerSideProps({ params }) {
  const { idVoie, balId }: { idVoie: string; balId: string } = params;

  try {
    const { baseLocale, commune }: BaseEditorProps =
      await getBaseEditorProps(balId);
    const voie: ExtendedVoieDTO = await VoiesService.findVoie(idVoie);

    return {
      props: {
        baseLocale,
        commune,
        voie,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default VoiePage;
