import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import VoieEditor from "@/components/bal/voie-editor";
import ProtectedPage from "@/layouts/protected-page";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import LayoutContext from "@/contexts/layout";
import NextLink from "next/link";
import { Text, Link } from "evergreen-ui";
import MapContext from "@/contexts/map";
import { TilesLayerMode } from "@/components/map/layers/tiles";

interface NewVoiePageProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function NewVoiePage({ baseLocale }: NewVoiePageProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);
  const { setTileLayersMode } = useContext(MapContext);

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.VOIE);
  }, [setTileLayersMode]);

  useEffect(() => {
    setBreadcrumbs(
      <>
        <Link is={NextLink} href={`/bal/${baseLocale.id}/${TabsEnum.VOIES}`}>
          Voies
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text aria-current="page">Nouvelle voie</Text>
      </>
    );

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, baseLocale.id]);

  return (
    <ProtectedPage>
      <VoieEditor
        onClose={() => {
          router.push(`/bal/${baseLocale.id}/${TabsEnum.VOIES}`);
        }}
        onSubmit={(idVoie) => {
          router.push(
            `/bal/${baseLocale.id}/${TabsEnum.VOIES}/${idVoie}/numeros`
          );
        }}
      />
    </ProtectedPage>
  );
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);

    return {
      props: {
        baseLocale,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default NewVoiePage;
