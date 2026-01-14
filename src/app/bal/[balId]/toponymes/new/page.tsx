"use client";

import ProtectedPage from "@/layouts/protected-page";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import LayoutContext from "@/contexts/layout";
import NextLink from "next/link";
import { Text, Link } from "evergreen-ui";
import ToponymeEditor from "@/components/bal/toponyme-editor";
import BalDataContext from "@/contexts/bal-data";
import MapContext from "@/contexts/map";
import { TilesLayerMode } from "@/components/map/layers/tiles";

export default function NewToponymePage() {
  const router = useRouter();
  const { setBreadcrumbs } = useContext(LayoutContext);
  const { commune, baseLocale } = useContext(BalDataContext);
  const { setTileLayersMode } = useContext(MapContext);

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.TOPONYME);
  }, [setTileLayersMode]);

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
