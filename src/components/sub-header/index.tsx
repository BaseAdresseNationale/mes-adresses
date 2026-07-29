import { useCallback, useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Pane } from "evergreen-ui";

import usePublishProcess from "@/hooks/publish-process";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import HabilitationProcess from "@/components/habilitation-process/index";
import Breadcrumbs from "@/components/breadcrumbs";
import SettingsMenu from "@/components/sub-header/settings-menu";
import MassDeletionDialog from "@/components/mass-deletion-dialog";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";
import Publication from "./publication";
import { HabilitationDTO, HabilitationService } from "@/lib/openapi-api-bal";

interface SubHeaderProps {
  commune: CommuneType;
}

function SubHeader({ commune }: SubHeaderProps) {
  const {
    baseLocale,
    habilitation,
    isRefrehSyncStat,
    habilitationIsLoading,
    isHabilitationProcessDisplayed,
    setIsHabilitationProcessDisplayed,
  } = useContext(BalDataContext);
  const { token, tokenIsChecking } = useContext(TokenContext);
  const isAdmin = Boolean(token);
  const { isMobile } = useContext(LayoutContext);

  const handleClose = useCallback(() => {
    setIsHabilitationProcessDisplayed(false);
  }, [setIsHabilitationProcessDisplayed]);

  const {
    massDeletionConfirm,
    setMassDeletionConfirm,
    handleShowHabilitationProcess,
    handlePublication,
  } = usePublishProcess(commune);

  const [isHabilitationValid, setIsHabilitationValid] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    async function checkHabilitationValid() {
      const result = await HabilitationService.findIsValid(baseLocale.id);
      setIsHabilitationValid(result);
    }
    if (habilitation) {
      setIsHabilitationValid(
        habilitation?.status === HabilitationDTO.status.ACCEPTED
      );
    } else {
      checkHabilitationValid();
    }
  }, [habilitation, baseLocale.id]);

  const onPublication = useCallback(() => {
    console.log("PUBLIER");
    if (isAdmin && habilitation && isHabilitationValid) {
      handlePublication();
    } else {
      handleShowHabilitationProcess();
    }
  }, [
    isAdmin,
    habilitation,
    handlePublication,
    isHabilitationValid,
    handleShowHabilitationProcess,
  ]);

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
          <Breadcrumbs baseLocale={baseLocale} marginLeft={8} />
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
            {isAdmin && (
              <Pane
                display="flex"
                {...(isMobile
                  ? {
                      justifyContent: "space-between",
                      width: "100%",
                    }
                  : { marginRight: 16 })}
              >
                <Publication
                  baseLocale={baseLocale}
                  isAdmin={isAdmin}
                  isRefrehSyncStat={isRefrehSyncStat}
                  onPublication={onPublication}
                />
              </Pane>
            )}
            {isMobile ? (
              ReactDOM.createPortal(
                <SettingsMenu />,
                document.getElementById("header-menu-wrapper")
              )
            ) : (
              <SettingsMenu />
            )}
          </Pane>
        )}
      </Pane>

      {isAdmin && habilitation && isHabilitationProcessDisplayed && (
        <HabilitationProcess
          baseLocale={baseLocale}
          commune={commune}
          habilitation={habilitation}
          resetHabilitationProcess={handleShowHabilitationProcess}
          handleClose={handleClose}
          handlePublication={handlePublication}
        />
      )}
    </>
  );
}

export default SubHeader;
