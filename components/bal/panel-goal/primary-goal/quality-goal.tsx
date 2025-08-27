import { Pane, Heading, Paragraph, Text } from "evergreen-ui";

import style from "../goal-card.module.css";
import StarRating from "./star-rating";

interface QualityGoalProps {}

function QualityGoal({}: QualityGoalProps) {
  return (
    <Pane className={style["goal-card"]}>
      <Heading>💎 Qualité</Heading>
      <StarRating value={3} />
      <Paragraph marginTop={16}>
        Il reste 3 alertes à corriger, dont <Text color="red">1 erreur(s)</Text>{" "}
        critique et <Text color="orange">2 warning(s)</Text>.
      </Paragraph>
    </Pane>
  );
}

export default QualityGoal;
