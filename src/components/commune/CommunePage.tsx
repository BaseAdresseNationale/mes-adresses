"use client";

import { useContext, useEffect, useState } from "react";
import { Pane } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import { BaseLocale } from "@/lib/openapi-api-bal";
import ReadOnlyInfos from "@/components/bal/read-only-infos";
import CommuneNomsAltEditor from "@/components/bal/commune-noms-alt-editor";
import BALSummary from "@/components/bal/bal-summary";
import BALRecoveryContext from "@/contexts/bal-recovery";
import PanelGoal from "@/components/bal/panel-goal/index";
import MapContext from "@/contexts/map";
import { TilesLayerMode } from "@/components/map/layers/tiles";
import CertificationInfos from "@/components/bal/certification-infos";

interface CommunePageProps {
  communeFlag?: string;
}

export default function CommunePage({ communeFlag }: CommunePageProps) {
  const { baseLocale, commune, voies, toponymes, reloadBaseLocale } =
    useContext(BalDataContext);
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);
  const [isCommuneFormOpen, setIsCommuneFormOpen] = useState<boolean>(false);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { setTileLayersMode } = useContext(MapContext);

  const openRecoveryDialog = () => {
    setIsRecoveryDisplayed(true);
  };

  useEffect(() => {
    reloadBaseLocale();
    setTileLayersMode(TilesLayerMode.VOIE);
  }, [reloadBaseLocale, setTileLayersMode]);

  return (
    <Pane overflowY="auto">
      {isCommuneFormOpen && (
        <CommuneNomsAltEditor
          initialValue={baseLocale as BaseLocale}
          closeForm={() => {
            setIsCommuneFormOpen(false);
          }}
        />
      )}
      <BALSummary
        baseLocale={baseLocale}
        commune={commune}
        voies={voies}
        toponymes={toponymes}
        communeFlag={communeFlag}
        onEditNomsAlt={() => {
          setIsCommuneFormOpen(true);
        }}
      />
      {!isAdmin && (
        <>
          <ReadOnlyInfos openRecoveryDialog={openRecoveryDialog} />
          <CertificationInfos baseLocale={baseLocale} />
        </>
      )}
      {isAdmin && baseLocale.status !== BaseLocale.status.DEMO && (
        <PanelGoal
          commune={commune}
          onEditNomsAlt={() => {
            setIsCommuneFormOpen(true);
          }}
        />
      )}
    </Pane>
  );
}
