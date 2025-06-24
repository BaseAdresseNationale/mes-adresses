import React, { useContext, useState } from "react";
import { Pane } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import {
  BaseLocale,
  ExtendedVoieDTO,
  ExtentedToponymeDTO,
} from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";
import ReadOnlyInfos from "@/components/bal/read-only-infos";
import HabilitationInfos from "@/components/bal/habilitation-infos";
import CertificationInfos from "@/components/bal/certification-infos";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import { getCommuneFlag } from "@/lib/api-blason-commune";
import CommuneNomsAltEditor from "@/components/bal/commune-noms-alt-editor";
import BALSummary from "@/components/bal/bal-summary";
import BALRecoveryContext from "@/contexts/bal-recovery";

interface BALHomePageProps {
  commune: CommuneType;
  voies: ExtendedVoieDTO[];
  toponymes: ExtentedToponymeDTO[];
  communeFlag?: string;
}

function BALHomePage({
  commune,
  communeFlag,
  voies,
  toponymes,
}: BALHomePageProps) {
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);
  const [isCommuneFormOpen, setIsCommuneFormOpen] = useState<boolean>(false);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  const openRecoveryDialog = () => {
    setIsRecoveryDisplayed(true);
  };

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
      <CertificationInfos openRecoveryDialog={!isAdmin && openRecoveryDialog} />
    </Pane>
  );
}

export async function getServerSideProps({ params, res }) {
  const { balId }: { balId: string } = params;

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);

    const communeFlag = await getCommuneFlag(commune.code);

    return {
      props: {
        baseLocale,
        commune,
        communeFlag,
        voies,
        toponymes,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default BALHomePage;
