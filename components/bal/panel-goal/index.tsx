import React, { useCallback, useContext, useState } from "react";
import { Heading, Pane } from "evergreen-ui";

import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
} from "@/lib/openapi-api-bal";
import PublicationGoal from "@/components/bal/panel-goal/primary-goal/publication-goal";
import CertificationGoal from "@/components/bal/panel-goal/primary-goal/certification-goal";
import QualityGoal from "@/components/bal/panel-goal/primary-goal/quality-goal";
import { CommuneType } from "@/types/commune";
import LangGoal from "./secondary-goal/lang-goal";
import ToponymeGoal from "./secondary-goal/toponyme-goal";
import { AccordionSimple } from "./secondary-goal/accordion-simple";
import BalDataContext from "@/contexts/bal-data";

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
    async (goal: "languageGoalAccepted" | "toponymeGoalAccepted") => {
      await BasesLocalesService.updateBaseLocale(baseLocale.id, {
        settings: {
          ...baseLocale.settings,
          [goal]: false,
        },
      });
      await reloadBaseLocale();
    },
    [baseLocale.id, baseLocale.settings, reloadBaseLocale]
  );

  return (
    <Pane>
      <Heading margin={16}>
        Objectif{isPublished && "s"} Principal{isPublished && "s"}
      </Heading>
      <PublicationGoal commune={commune} baseLocale={baseLocale} />
      {isPublished && (
        <>
          <CertificationGoal baseLocale={baseLocale} />
          {(settings.toponymeGoalAccepted !== false ||
            settings.languageGoalAccepted !== false) && (
            <AccordionSimple
              title="Objectifs secondaires"
              isActive={isActive}
              onClick={() => setIsActive(!isActive)}
            >
              {settings.toponymeGoalAccepted !== false && (
                <ToponymeGoal
                  baseLocale={baseLocale}
                  onIgnoreGoal={() => ignoreGoal("toponymeGoalAccepted")}
                />
              )}
              {settings.languageGoalAccepted !== false && (
                <LangGoal
                  baseLocale={baseLocale}
                  onEditNomsAlt={onEditNomsAlt}
                  onIgnoreGoal={() => ignoreGoal("languageGoalAccepted")}
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
