import {
  ExtendedBaseLocaleDTO,
  ExtentedToponymeDTO,
  ToponymesService,
} from "@/lib/openapi-api-bal";
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
import SearchPaginationContext from "@/contexts/search-pagination";
import { getLinkWithPagination } from "@/hooks/search-pagination";

interface ToponymePageProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneType;
  toponyme: ExtentedToponymeDTO;
}

function ToponymePage({ baseLocale, commune, toponyme }: ToponymePageProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);
  const { savedSearchPagination, setLastSelectedItem } = useContext(
    SearchPaginationContext
  );

  useEffect(() => {
    setLastSelectedItem((prev) => ({
      ...prev,
      [TabsEnum.TOPONYMES]: toponyme.id,
    }));
    setBreadcrumbs(
      <>
        <Link
          is={NextLink}
          href={getLinkWithPagination(
            `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}`,
            savedSearchPagination[TabsEnum.TOPONYMES]
          )}
        >
          Toponymes
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text aria-current="page">{toponyme.nom}</Text>
      </>
    );

    return () => {
      setBreadcrumbs(null);
    };
  }, [
    setBreadcrumbs,
    baseLocale.id,
    toponyme,
    setLastSelectedItem,
    savedSearchPagination,
  ]);

  return (
    <ProtectedPage>
      <ToponymeEditor
        initialValue={toponyme}
        commune={commune}
        closeForm={() => {
          router.push(`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}`);
        }}
      />
    </ProtectedPage>
  );
}

export async function getServerSideProps({ params }) {
  const { idToponyme, balId }: { idToponyme: string; balId: string } = params;

  try {
    const { baseLocale, commune }: BaseEditorProps =
      await getBaseEditorProps(balId);
    const toponyme: ExtentedToponymeDTO =
      await ToponymesService.findToponyme(idToponyme);

    return {
      props: {
        baseLocale,
        commune,
        toponyme,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default ToponymePage;
