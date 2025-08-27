import React, { useContext, useState } from "react";
import { Heading, Pane } from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import {
  BaseLocale,
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
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
import PublicationGoal from "@/components/bal/publication-goal";
import CertificationGoal from "@/components/bal/certification-goal";
import { CommuneType } from "@/types/commune";
import QualityGoal from "./quality-goal";

interface PanelGoalProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
}

function PanelGoal({ commune, baseLocale }: PanelGoalProps) {
  //   const { baseLocale, commune } = useContext(BalDataContext);
  //   const { token } = useContext(TokenContext);
  //   const isAdmin = Boolean(token);
  //   const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  //   const openRecoveryDialog = () => {
  //     setIsRecoveryDisplayed(true);
  //   };

  return (
    <Pane>
      <Heading margin={16}>Objectif(s) Principal(s)</Heading>
      <PublicationGoal commune={commune} baseLocale={baseLocale} />
      {baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED && (
        <>
          <CertificationGoal baseLocale={baseLocale} />
          <QualityGoal />
        </>
      )}
    </Pane>
  );
}

export default PanelGoal;
