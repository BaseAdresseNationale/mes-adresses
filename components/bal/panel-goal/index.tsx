import React, { useState } from "react";
import { Heading, Pane } from "evergreen-ui";

import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import PublicationGoal from "@/components/bal/panel-goal/primary-goal/publication-goal";
import CertificationGoal from "@/components/bal/panel-goal/primary-goal/certification-goal";
import QualityGoal from "@/components/bal/panel-goal/primary-goal/quality-goal";
import { CommuneType } from "@/types/commune";
import LangGoal from "./secondary-goal/lang-goal";
import ToponymeGoal from "./secondary-goal/toponyme-goal";
import { AccordionSimple } from "./secondary-goal/accordion-simple";

interface PanelGoalProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
}

function PanelGoal({ commune, baseLocale }: PanelGoalProps) {
  const isPublished =
    baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED;

  const [isActive, setIsActive] = useState(false);

  return (
    <Pane>
      <Heading margin={16}>
        Objectif{isPublished && "s"} Principal{isPublished && "s"}
      </Heading>
      <PublicationGoal commune={commune} baseLocale={baseLocale} />
      {isPublished && (
        <>
          <CertificationGoal baseLocale={baseLocale} />
          {/* <QualityGoal /> */}
          {/* <Heading margin={16}>Objectifs secondaires</Heading> */}
          <AccordionSimple
            title="Objectifs secondaires"
            isActive={isActive}
            onClick={() => setIsActive(!isActive)}
          >
            <ToponymeGoal baseLocale={baseLocale} />
            <LangGoal baseLocale={baseLocale} />
          </AccordionSimple>
        </>
      )}
    </Pane>
  );
}

export default PanelGoal;
