import React, { useContext, useEffect, useState } from "react";
import { Pane } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import {
  BaseLocale,
  BasesLocalesService,
  ExtendedVoieDTO,
  ExtentedToponymeDTO,
} from "@/lib/openapi-api-bal";
import ReadOnlyInfos from "@/components/bal/read-only-infos";
import HabilitationInfos from "@/components/bal/habilitation-infos";
import CertificationInfos from "@/components/bal/certification-infos";
import { getCommuneFlag } from "@/lib/api-blason-commune";
import CommuneNomsAltEditor from "@/components/bal/commune-noms-alt-editor";
import BALSummary from "@/components/bal/bal-summary";
import BALRecoveryContext from "@/contexts/bal-recovery";
import MapContext from "@/contexts/map";
import { TilesLayerMode } from "@/components/map/layers/tiles";

interface BALHomePageProps {
  voies: ExtendedVoieDTO[];
  toponymes: ExtentedToponymeDTO[];
  communeFlag?: string;
}

function BALHomePage({ communeFlag, voies, toponymes }: BALHomePageProps) {
  const { baseLocale, commune } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);
  const [isCommuneFormOpen, setIsCommuneFormOpen] = useState<boolean>(false);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { setTileLayersMode } = useContext(MapContext);

  const openRecoveryDialog = () => {
    setIsRecoveryDisplayed(true);
  };

  useEffect(() => {
    setTileLayersMode(TilesLayerMode.CERTIFICATION);
  }, [setTileLayersMode]);

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
      {!isAdmin && <ReadOnlyInfos openRecoveryDialog={openRecoveryDialog} />}
      {isAdmin && baseLocale.status !== BaseLocale.status.DEMO && (
        <HabilitationInfos commune={commune} />
      )}
      <CertificationInfos />
    </Pane>
  );
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

  try {
    const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);
    const communeFlag = await getCommuneFlag(baseLocale.commune);

    return {
      props: {
        baseLocale,
        communeFlag,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default BALHomePage;
