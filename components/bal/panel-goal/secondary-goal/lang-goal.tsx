import { Pane, Heading, Paragraph, Text } from "evergreen-ui";

import style from "../goal-card.module.css";
import { useContext } from "react";
import BalDataContext from "@/contexts/bal-data";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface LangGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function LangGoal({ baseLocale }: LangGoalProps) {
  const { voies, toponymes } = useContext(BalDataContext);

  const voiesWithLang = voies.filter((voie) => voie.nomAlt).length;
  const toponymesWithLang = toponymes.filter(
    (toponyme) => toponyme.nomAlt
  ).length;

  return (
    <Pane className={style["goal-card"]}>
      <Heading>🇧🇹 Langue(s)</Heading>
      <Paragraph marginTop={16}>
        Vous pouvez remplir les champs de langue régionale pour améliorer la
        qualité de votre Base Adresse Locale.
      </Paragraph>
      <Paragraph>
        La BAL contient {voiesWithLang} voie(s) et {toponymesWithLang}{" "}
        toponyme(s) avec des langues régionales.
      </Paragraph>
    </Pane>
  );
}

export default LangGoal;
