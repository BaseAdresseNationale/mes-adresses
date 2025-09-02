import { Pane, Heading, Paragraph, Text } from "evergreen-ui";

import style from "../goal-card.module.css";
import StarRating from "./star-rating";
import { AccordionCard } from "@/components/signalement/signalement-diff/accordion-card";
import { useState } from "react";
import AchievementBadge from "../achievements-badge";
import ProgressBar from "@/components/progress-bar";
import Counter from "@/components/counter";

interface QualityGoalProps {}

function QualityGoal({}: QualityGoalProps) {
  const [isActive, setIsActive] = useState(false);

  const isAllCertified = false;
  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane display="flex" alignItems="center" gap={16}>
              <AchievementBadge
                icone="/static/images/achievements/fiabilite.svg"
                title="Publication"
                completed={isAllCertified}
              />
              <Heading color={isAllCertified && "#317159"}>Qualité</Heading>
            </Pane>
            <Pane width="100%">
              <StarRating value={3} />
              <Pane display="flex" justifyContent="center" alignItems="center">
                <Counter label="Erreurs détectées" value={1} color="red" />
                <Counter label="Warnings détectés" value={2} color="#orange" />
              </Pane>
            </Pane>
          </Pane>
        }
        backgroundColor="white"
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        <Pane padding={8}>
          <Heading size={400}>Qualité</Heading>
          <Text>
            Pour garantir la qualité de votre Base Adresse Locale, il est{" "}
            <u>important de corriger les alertes</u>.
            <br />
            <br />
            Les alertes sont des indicateurs de qualité de votre Base Adresse
            Locale. Elles sont classées en erreurs et warnings.
            <br />
            Pour garantir la qualité de votre Base Adresse Locale, il est
            important de corriger les alertes.
            <br />
            <br />
            Les erreurs sont des alertes qui doivent être corrigées avant la
            publication de votre Base Adresse Locale.
            <br />
            Les warnings sont des alertes qui peuvent être corrigées après la
            publication de votre Base Adresse Locale.
          </Text>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default QualityGoal;
