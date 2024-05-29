import { useContext } from "react";
import ReactDOM from "react-dom";
import { Pane } from "evergreen-ui";

import usePublishProcess from "@/hooks/publish-process";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import HabilitationProcess from "@/components/habilitation-process/index";
import Breadcrumbs from "@/components/breadcrumbs";
import COMDialog from "@/components/habilitation-process/com-dialog";
import SettingsMenu from "@/components/sub-header/settings-menu";
import BALStatus from "@/components/sub-header/bal-status";
import MassDeletionDialog from "@/components/mass-deletion-dialog";
import { CommuneType } from "@/types/commune";
import LayoutContext from "@/contexts/layout";

interface SubHeaderProps {
  commune: CommuneType;
}

function SubHeader({ commune }: SubHeaderProps) {
  const {
    baseLocale,
    habilitation,
    reloadBaseLocale,
    isHabilitationValid,
    voie,
    toponyme,
    isRefrehSyncStat,
    habilitationIsLoading,
    isHabilitationProcessDisplayed,
    setIsHabilitationProcessDisplayed,
  } = useContext(BalDataContext);
  const { token, tokenIsChecking } = useContext(TokenContext);
  const isAdmin = Boolean(token);
  const { isMobile } = useContext(LayoutContext);

  const {
    massDeletionConfirm,
    setMassDeletionConfirm,
    handleShowHabilitationProcess,
    handlePublication,
  } = usePublishProcess(commune);

  return (
    <>
      <MassDeletionDialog
        isShown={Boolean(massDeletionConfirm)}
        handleConfirm={massDeletionConfirm}
        handleCancel={() => setMassDeletionConfirm(null)}
        onClose={() => setMassDeletionConfirm(null)}
      />

      <Pane
        position="fixed"
        top={isMobile ? 70 : 76}
        left={0}
        height={40}
        width="100%"
        background="tint1"
        elevation={0}
        zIndex={3}
        display="flex"
        alignItems="center"
        padding={8}
        {...(isMobile
          ? {
              flexDirection: "column",
              height: 80,
              alignItems: "flex-start",
              justifyContent: "space-around",
            }
          : { height: 40 })}
      >
        <Pane order={isMobile ? 2 : 1}>
          <Breadcrumbs
            baseLocale={baseLocale}
            commune={commune}
            voie={voie}
            toponyme={toponyme}
            marginLeft={8}
          />
        </Pane>
        {!tokenIsChecking && !habilitationIsLoading && (
          <Pane
            display="flex"
            alignItems="center"
            width="100%"
            {...(isMobile
              ? { order: 1, justifyContent: "space-between" }
              : { order: 2, justifyContent: "flex-end" })}
          >
            {isMobile ? (
              ReactDOM.createPortal(
                <SettingsMenu isAdmin={isAdmin} />,
                document.getElementById("header-menu-wrapper")
              )
            ) : (
              <SettingsMenu isAdmin={isAdmin} />
            )}
            <Pane
              display="flex"
              {...(isMobile && {
                justifyContent: "space-between",
                width: "100%",
              })}
            >
              <BALStatus
                baseLocale={baseLocale}
                commune={commune}
                token={token}
                isHabilitationValid={isHabilitationValid}
                isRefrehSyncStat={isRefrehSyncStat}
                handlePublication={handlePublication}
                handleHabilitation={handleShowHabilitationProcess}
                reloadBaseLocale={async () => reloadBaseLocale()}
              />
            </Pane>
          </Pane>
        )}
      </Pane>

      {isAdmin && isHabilitationProcessDisplayed && commune.isCOM && (
        <COMDialog
          baseLocaleId={baseLocale._id}
          handleClose={() => setIsHabilitationProcessDisplayed(false)}
        />
      )}

      {isAdmin && habilitation && isHabilitationProcessDisplayed && (
        <HabilitationProcess
          baseLocale={baseLocale}
          commune={commune}
          habilitation={habilitation}
          resetHabilitationProcess={handleShowHabilitationProcess}
          handleClose={() => setIsHabilitationProcessDisplayed(false)}
          handlePublication={handlePublication}
        />
      )}
    </>
  );
}

export default SubHeader;
