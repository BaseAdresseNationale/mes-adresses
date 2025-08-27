import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import ProtectedPage from "@/layouts/protected-page";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import LayoutContext from "@/contexts/layout";
import NextLink from "next/link";
import { Text, Link } from "evergreen-ui";
import ToponymeEditor from "@/components/bal/toponyme-editor";
import BalDataContext from "@/contexts/bal-data";

interface NewToponymePageProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function NewToponymePage({ baseLocale }: NewToponymePageProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);
  const { commune } = useContext(BalDataContext);

  useEffect(() => {
    setBreadcrumbs(
      <>
        <Link
          is={NextLink}
          href={`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}`}
        >
          Toponymes
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text aria-current="page">Nouveau toponyme</Text>
      </>
    );

    return () => {
      setBreadcrumbs(null);
    };
  }, [setBreadcrumbs, baseLocale.id]);

  return (
    <ProtectedPage>
      <ToponymeEditor
        commune={commune}
        onClose={() => {
          router.push(`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}`);
        }}
        onSubmit={(idToponyme) => {
          router.push(
            `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${idToponyme}/numeros`
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

export default NewToponymePage;
