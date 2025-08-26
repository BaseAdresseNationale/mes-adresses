import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  ExtentedToponymeDTO,
  ToponymesService,
} from "@/lib/openapi-api-bal";
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
import BalDataContext from "@/contexts/bal-data";

interface ToponymePageProps {
  baseLocale: ExtendedBaseLocaleDTO;
  toponyme: ExtentedToponymeDTO;
}

function ToponymePage({ baseLocale, toponyme }: ToponymePageProps) {
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);
  const { savedSearchPagination, setLastSelectedItem } = useContext(
    SearchPaginationContext
  );
  const { commune } = useContext(BalDataContext);

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
        onClose={() => {
          router.push(
            `/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${toponyme.id}/numeros`
          );
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
  const { idToponyme, balId }: { idToponyme: string; balId: string } = params;

  try {
    const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);
    const toponyme: ExtentedToponymeDTO =
      await ToponymesService.findToponyme(idToponyme);

    return {
      props: {
        baseLocale,
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
