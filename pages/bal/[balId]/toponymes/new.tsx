import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import { CommuneType } from "@/types/commune";
import ProtectedPage from "@/layouts/protected-page";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import LayoutContext from "@/contexts/layout";
import NextLink from "next/link";
import { Text, Link } from "evergreen-ui";
import ToponymeEditor from "@/components/bal/toponyme-editor";

interface NewToponymePageProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneType;
}

function NewToponymePage({ baseLocale, commune }: NewToponymePageProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);

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
        <Text>Nouveau toponyme</Text>
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
        closeForm={() => {
          router.push(`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}`);
        }}
      />
    </ProtectedPage>
  );
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const { baseLocale, commune }: BaseEditorProps =
      await getBaseEditorProps(balId);

    return {
      props: {
        baseLocale,
        commune,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default NewToponymePage;
