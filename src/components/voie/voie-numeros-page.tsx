"use client";

import { useEffect, useContext } from "react";
import { Pane, Text, Link } from "evergreen-ui";
import NextLink from "next/link";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";

import useHelp from "@/hooks/help";
import useFormState from "@/hooks/useFormState";

import NumeroEditor from "@/components/bal/numero-editor";
import VoieHeading from "@/components/voie/voie-heading";
import NumerosList from "@/components/voie/numeros-list";
import { VoieMetas, VoiesService } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import SearchPaginationContext from "@/contexts/search-pagination";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { getLinkWithPagination } from "@/hooks/search-pagination";
import MapContext from "@/contexts/map";
import { TilesLayerMode } from "@/components/map/layers/tiles";

export function VoieNumerosPage() {
  const { isFormOpen, handleEditing, editedNumero, reset } = useFormState();

  useHelp(3);

  const { token } = useContext(TokenContext);
  const { setVoie, reloadVoieNumeros, commune, baseLocale, voie, numeros } =
    useContext(BalDataContext);
  const { setBreadcrumbs } = useContext(LayoutContext);
  const { savedSearchPagination, setLastSelectedItem } = useContext(
    SearchPaginationContext
  );
  const { setTileLayersMode } = useContext(MapContext);

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.VOIE);
  }, [setTileLayersMode]);

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
        <Link
          is={NextLink}
          href={`/bal/${baseLocale.id}/${TabsEnum.VOIES}/${voie.id}`}
        >
          {voie.nom}{" "}
        </Link>
        <Text color="muted">{" > "}</Text>
        <Text aria-current="page">Liste des numéros</Text>
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

  useEffect(() => {
    async function addCommentsToVoies() {
      try {
        const voieMetas: VoieMetas = await VoiesService.findVoieMetas(voie.id);
        setVoie({ ...voie, ...voieMetas });
      } catch (e) {
        console.error("Impossible de charger les commentaires de voie", e);
      }
    }

    if (token) {
      addCommentsToVoies();
      reloadVoieNumeros(voie.id);
    }
  }, [token]);

  return (
    <>
      <VoieHeading baseLocale={baseLocale} voie={voie} />
      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        {isFormOpen ? (
          <NumeroEditor
            initialVoieId={voie.id}
            initialValue={editedNumero}
            commune={commune}
            closeForm={reset}
          />
        ) : (
          <NumerosList
            commune={commune}
            token={token}
            voie={voie}
            numeros={numeros}
            handleEditing={handleEditing}
          />
        )}
      </Pane>
    </>
  );
}
