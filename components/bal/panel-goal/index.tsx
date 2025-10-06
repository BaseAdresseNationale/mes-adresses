import React, { useCallback, useContext, useState } from "react";
import { Heading, Pane } from "evergreen-ui";

import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import PublicationGoal from "@/components/bal/panel-goal/primary-goal/publication-goal";
import CertificationGoal from "@/components/bal/panel-goal/primary-goal/certification-goal";
import { CommuneType } from "@/types/commune";
import LangGoal from "./secondary-goal/lang-goal";
import ToponymeGoal from "./secondary-goal/toponyme-goal";
import { AccordionSimple } from "./secondary-goal/accordion-simple";
import BalDataContext from "@/contexts/bal-data";
import QualityGoal from "./primary-goal/quality-goal";

interface PanelGoalProps {
  commune: CommuneType;
  onEditNomsAlt: () => void;
}

function PanelGoal({ commune, onEditNomsAlt }: PanelGoalProps) {
  const { baseLocale, reloadBaseLocale } = useContext(BalDataContext);
  const { settings } = baseLocale;
  const isPublished =
    baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED;
  const [isActive, setIsActive] = useState(false);

  const ignoreGoal = useCallback(
    async (goal: "toponymeGoalIgnored" | "languageGoalIgnored") => {
      await BasesLocalesService.updateBaseLocale(baseLocale.id, {
        settings: {
          ...baseLocale.settings,
          [goal]: true,
        },
      });
      await reloadBaseLocale();
    },
    [baseLocale.id, baseLocale.settings, reloadBaseLocale]
  );

  return (
    <Pane>
      <PublicationGoal commune={commune} baseLocale={baseLocale} />
      {isPublished && (
        <>
          <CertificationGoal baseLocale={baseLocale} />
          <QualityGoal baseLocale={baseLocale} />
          {(!settings?.toponymeGoalIgnored ||
            !settings?.languageGoalIgnored) && (
            <AccordionSimple
              title="Objectifs secondaires"
              isActive={isActive}
              onClick={() => setIsActive(!isActive)}
            >
              {!settings?.toponymeGoalIgnored && (
                <ToponymeGoal
                  baseLocale={baseLocale}
                  onIgnoreGoal={() => ignoreGoal("toponymeGoalIgnored")}
                />
              )}
              {!settings?.languageGoalIgnored && (
                <LangGoal
                  baseLocale={baseLocale}
                  onEditNomsAlt={onEditNomsAlt}
                  onIgnoreGoal={() => ignoreGoal("languageGoalIgnored")}
                />
              )}
            </AccordionSimple>
          )}
        </>
      )}
    </Pane>
  );
}

export default PanelGoal;
