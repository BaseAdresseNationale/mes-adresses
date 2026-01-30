"use client";

import VoieEditor from "@/components/bal/voie-editor";
import ProtectedPage from "@/layouts/protected-page";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import LayoutContext from "@/contexts/layout";
import NextLink from "next/link";
import { Text, Link } from "evergreen-ui";
import MapContext from "@/contexts/map";
import { TilesLayerMode } from "@/components/map/layers/tiles";
import BalDataContext from "@/contexts/bal-data";

export default function NewVoiePage() {
  const router = useRouter();
  const { baseLocale } = useContext(BalDataContext);
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
