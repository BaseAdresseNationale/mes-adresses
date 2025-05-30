import React, { useContext, useState } from "react";
import { Pane } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import { BaseLocale, ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";
import ReadOnlyInfos from "@/components/bal/read-only-infos";
import HabilitationInfos from "@/components/bal/habilitation-infos";
import CertificationInfos from "@/components/bal/certification-infos";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import { getCommuneFlag } from "@/lib/api-blason-commune";
import CommuneEditor from "@/components/bal/commune-editor";
import HeaderSideBar from "@/components/sidebar/header";

interface BALHomePageProps {
  commune: CommuneType;
  voies: ExtendedVoieDTO[];
  communeFlag?: string;
  openRecoveryDialog: () => void;
}

function BALHomePage({
  commune,
  communeFlag,
  voies,
  openRecoveryDialog,
}: BALHomePageProps) {
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);
  const [isCommuneFormOpen, setIsCommuneFormOpen] = useState<boolean>(false);

  return (
    <Pane overflowY="auto">
      <HeaderSideBar
        baseLocale={baseLocale}
        commune={commune}
        voies={voies}
        openForm={() => {
          setIsCommuneFormOpen(true);
        }}
      />
      {isCommuneFormOpen && (
        <CommuneEditor
          initialValue={baseLocale as BaseLocale}
          closeForm={() => {
            setIsCommuneFormOpen(false);
          }}
        />
      )}
      <Pane
        height={100}
        flexShrink={0}
        backgroundImage={`url(${communeFlag})`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        marginTop={50}
        marginX={10}
      />
      {!isAdmin && <ReadOnlyInfos openRecoveryDialog={openRecoveryDialog} />}
      {isAdmin && baseLocale.status !== BaseLocale.status.DEMO && (
        <HabilitationInfos commune={commune} />
      )}
      <CertificationInfos openRecoveryDialog={!isAdmin && openRecoveryDialog} />
    </Pane>
  );
}

export async function getServerSideProps({ params }) {
  const { balId }: { balId: string } = params;

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
