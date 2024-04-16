import { useContext } from "react";
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

interface SubHeader {
  commune: CommuneType;
}

function SubHeader({ commune }) {
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
        top={76}
        left={0}
        height={40}
        width="100%"
        background="tint1"
        elevation={0}
        zIndex={3}
        display="flex"
        alignItems="center"
        padding={8}
      >
        <Breadcrumbs
          baseLocale={baseLocale}
          commune={commune}
          voie={voie}
          toponyme={toponyme}
          marginLeft={8}
        />
        {!tokenIsChecking && !habilitationIsLoading && (
          <Pane marginLeft="auto" display="flex" alignItems="center">
            <SettingsMenu isAdmin={isAdmin} />
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
        )}
      </Pane>

      {isAdmin && isHabilitationProcessDisplayed && (
        <COMDialog
          baseLocaleId={baseLocale._id}
          handleClose={() => setIsHabilitationProcessDisplayed(false)}
        />
      )}

      {isAdmin &&
        habilitation &&
        isHabilitationProcessDisplayed && (
          <HabilitationProcess
            token={token}
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
