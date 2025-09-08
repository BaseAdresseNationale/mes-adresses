import { Pane, Heading, Paragraph, Text } from "evergreen-ui";

import style from "../goal-card.module.css";
import { useContext, useState } from "react";
import BalDataContext from "@/contexts/bal-data";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { AccordionCard } from "@/components/signalement/signalement-diff/accordion-card";
import AchievementBadge from "../achievements-badge";
import Counter from "@/components/counter";

interface LangGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function LangGoal({ baseLocale }: LangGoalProps) {
  const [isActive, setIsActive] = useState(false);
  const { toponymes } = useContext(BalDataContext);

  const nbNumerosWithToponymes = toponymes.reduce(
    (acc, toponyme) => acc + toponyme.nbNumeros,
    0
  );

  const isCompleted = toponymes.length > 0 && nbNumerosWithToponymes > 0;

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane display="flex" alignItems="center" gap={16}>
              <AchievementBadge
                icone="/static/images/achievements/panneau-directionnel.png"
                title="Publication"
                completed={isCompleted}
              />
              <Heading color={isCompleted && "#317159"}>Toponyme</Heading>
            </Pane>
            <Pane display="flex" justifyContent="start">
              <Counter
                label="Toponyme(s)"
                value={toponymes.length}
                color="#53301f"
              />
              <Counter
                label="Numéro(s) relié(s)"
                value={nbNumerosWithToponymes}
                color="#53301f"
              />
            </Pane>
          </Pane>
        }
        backgroundColor={isCompleted ? "#DCF2EA" : "white"}
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        <Pane padding={8}>
          <Paragraph>
            Il est important de remplir les lieux-dits et complément de votre
            commune dans l&apos;onglet toponyme.
          </Paragraph>
          <Paragraph>
            Il est important de remplir les lieux-dits et complément de votre
            commune dans l&apos;onglet toponyme.
          </Paragraph>
          <Paragraph>
            Il est important de remplir les lieux-dits et complément de votre
            commune dans l&apos;onglet toponyme.
          </Paragraph>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default LangGoal;
