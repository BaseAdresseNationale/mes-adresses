import { Pane, Heading, Paragraph, Text } from "evergreen-ui";

import style from "../goal-card.module.css";
import { useContext } from "react";
import BalDataContext from "@/contexts/bal-data";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface LangGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function LangGoal({ baseLocale }: LangGoalProps) {
  const { toponymes } = useContext(BalDataContext);

  return (
    <Pane className={style["goal-card"]}>
      <Heading>📍 Toponyme(s)</Heading>
      <Paragraph marginTop={16}>
        Il est important de remplir les lieux-dits et complément de votre
        commune dans l&apos;onglet toponyme.
      </Paragraph>
      <Paragraph>La BAL contient {toponymes.length} toponyme(s).</Paragraph>
    </Pane>
  );
}

export default LangGoal;
