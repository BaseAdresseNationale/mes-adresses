import React, { useCallback, useContext, useEffect } from "react";
import { Pane } from "evergreen-ui";

import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";

import useHelp from "@/hooks/help";

import CommuneTab from "@/components/bal/commune-tab";
import { CommuneType } from "@/types/commune";
import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import BALRecoveryContext from "@/contexts/bal-recovery";
import { BaseLocale, BasesLocalesService, BaseLocaleSync } from "@/lib/openapi";
import TabsSideBar, { TabsEnum } from "@/components/sidebar/tabs";
import usePublishProcess from "@/hooks/publish-process";
import HeaderSideBar from "@/components/sidebar/header";
import PopulateSideBar from "@/components/sidebar/populate";

interface BaseLocalePageProps {
  commune: CommuneType;
}

function BaseLocalePage({ commune }: BaseLocalePageProps) {
  const { token } = useContext(TokenContext);
  const { voies, baseLocale, habilitation, isHabilitationValid } =
    useContext(BalDataContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { handleShowHabilitationProcess } = usePublishProcess(commune);

  useHelp(TabsEnum.COMMUNE);

  useEffect(() => {
    if (
      token &&
      baseLocale.status === BaseLocale.status.PUBLISHED &&
      baseLocale.sync?.status === BaseLocaleSync.status.OUTDATED &&
      habilitation &&
      !isHabilitationValid
    ) {
      handleShowHabilitationProcess();
    }
  }, [baseLocale.status, baseLocale.sync?.status, isHabilitationValid, token]);

  return (
    <>
      <HeaderSideBar commune={commune} voies={voies} />
      <Pane
        position="relative"
        display="flex"
        flexDirection="column"
        height="100%"
        width="100%"
        overflow="hidden"
      >
        <TabsSideBar balId={baseLocale.id} tabSelected={TabsEnum.COMMUNE} />

        <CommuneTab
          commune={commune}
          openRecoveryDialog={() => {
            setIsRecoveryDisplayed(true);
          }}
        />

        {token && voies && voies.length === 0 && (
          <PopulateSideBar commune={commune} baseLocale={baseLocale} />
        )}
      </Pane>

      <style jsx>{`
        .tab {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: whitesmoke;
        }

        .tab:hover {
          cursor: pointer;
          background: #e4e7eb;
        }

        .tab.selected {
          background: #fff;
        }

        .tab .selected:hover {
          background: #e4e7eb;
        }

        .tab-notif {
          position: absolute;
          top: -10px;
          right: -5px;
          background: red;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 50%;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { balId } = params;

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);
    return {
      props: {
        commune,
        baseLocale,
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

export default BaseLocalePage;
