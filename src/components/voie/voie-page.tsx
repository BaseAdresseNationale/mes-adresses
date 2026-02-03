"use client";

import { VoieMetas, VoiesService } from "@/lib/openapi-api-bal";
import VoieEditor from "@/components/bal/voie-editor";
import ProtectedPage from "@/layouts/protected-page";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import LayoutContext from "@/contexts/layout";
import NextLink from "next/link";
import { Text, Link, Spinner } from "evergreen-ui";
import SearchPaginationContext from "@/contexts/search-pagination";
import { getLinkWithPagination } from "@/hooks/search-pagination";
import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";
import MapContext from "@/contexts/map";
import { TilesLayerMode } from "@/components/map/layers/tiles";

export default function VoiePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { setBreadcrumbs } = useContext(LayoutContext);
  const { setVoie, baseLocale, voie } = useContext(BalDataContext);
  const { savedSearchPagination, setLastSelectedItem } = useContext(
    SearchPaginationContext
  );
  const { token } = useContext(TokenContext);
  const { setTileLayersMode } = useContext(MapContext);

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.VOIE);
  }, [setTileLayersMode]);

  useEffect(() => {
    async function addCommentsToVoies() {
      try {
        const voieMetas: VoieMetas = await VoiesService.findVoieMetas(voie.id);
        setVoie({ ...voie, ...voieMetas });
      } catch (e) {
        console.error("Impossible de charger les commentaires de voie", e);
      } finally {
        setIsLoading(false);
      }
    }

    if (token) {
      addCommentsToVoies();
    }
  }, [token]);

  useEffect(() => {
    setLastSelectedItem((prev) => ({
      ...prev,
      [TabsEnum.VOIES]: voie.id,
    }));
    setBreadcrumbs(
      <>
        <Link
          is={NextLink}
          href={getLinkWithPagination(
            `/bal/${baseLocale.id}/${TabsEnum.VOIES}`,
            savedSearchPagination[TabsEnum.VOIES]
          )}
        >
          Voies
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text aria-current="page">{voie.nom}</Text>
      </>
    );

    return () => {
      setBreadcrumbs(null);
    };
  }, [
    setBreadcrumbs,
    baseLocale.id,
    voie,
    setLastSelectedItem,
    savedSearchPagination,
  ]);

  return (
    <ProtectedPage>
      {isLoading ? (
        <Spinner />
      ) : (
        <VoieEditor
          initialValue={voie}
          onClose={() => {
            router.push(
              `/bal/${baseLocale.id}/${TabsEnum.VOIES}/${voie.id}/numeros`
            );
          }}
          onSubmit={(idVoie) => {
            router.push(
              `/bal/${baseLocale.id}/${TabsEnum.VOIES}/${idVoie}/numeros`
            );
          }}
        />
      )}
    </ProtectedPage>
  );
}
