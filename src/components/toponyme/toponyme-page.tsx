"use client";

import ProtectedPage from "@/layouts/protected-page";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import LayoutContext from "@/contexts/layout";
import NextLink from "next/link";
import { Text, Link } from "evergreen-ui";
import ToponymeEditor from "@/components/bal/toponyme-editor";
import SearchPaginationContext from "@/contexts/search-pagination";
import { getLinkWithPagination } from "@/hooks/search-pagination";
import BalDataContext from "@/contexts/bal-data";
import { TilesLayerMode } from "@/components/map/layers/tiles";
import MapContext from "@/contexts/map";

export default function ToponymePage() {
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);
  const { savedSearchPagination, setLastSelectedItem } = useContext(
    SearchPaginationContext
  );
  const { commune, baseLocale, toponyme } = useContext(BalDataContext);
  const { setTileLayersMode } = useContext(MapContext);

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.TOPONYME);
  }, [setTileLayersMode]);

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
