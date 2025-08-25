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

interface NewVoiePageProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function NewVoiePage({ baseLocale }: NewVoiePageProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);

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
        closeForm={() => {
          router.push(`/bal/${baseLocale.id}/${TabsEnum.VOIES}`);
        }}
        onSubmitted={(idVoie) => {
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
