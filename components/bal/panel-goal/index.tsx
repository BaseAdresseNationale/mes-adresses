import React from "react";
import { Heading, Pane } from "evergreen-ui";

import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import PublicationGoal from "@/components/bal/panel-goal/primary-goal/publication-goal";
import CertificationGoal from "@/components/bal/panel-goal/primary-goal/certification-goal";
import QualityGoal from "@/components/bal/panel-goal/primary-goal/quality-goal";
import { CommuneType } from "@/types/commune";
import LangGoal from "./secondary-goal/lang-goal";
import ToponymeGoal from "./secondary-goal/toponyme-goal";

interface PanelGoalProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
}

function PanelGoal({ commune, baseLocale }: PanelGoalProps) {
  const isPublished =
    baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED;
  //   const { baseLocale, commune } = useContext(BalDataContext);
  //   const { token } = useContext(TokenContext);
  //   const isAdmin = Boolean(token);
  //   const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  //   const openRecoveryDialog = () => {
  //     setIsRecoveryDisplayed(true);
  //   };

  return (
    <Pane>
      <Heading margin={16}>
        Objectif{isPublished && "s"} Principal{isPublished && "s"}
      </Heading>
      <PublicationGoal commune={commune} baseLocale={baseLocale} />
      {baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED && (
        <>
          <CertificationGoal baseLocale={baseLocale} />
          <QualityGoal />
          <Heading margin={16}>Objectifs secondaires</Heading>
          <LangGoal baseLocale={baseLocale} />
          <ToponymeGoal baseLocale={baseLocale} />
        </>
      )}
    </Pane>
  );
}

export default PanelGoal;
