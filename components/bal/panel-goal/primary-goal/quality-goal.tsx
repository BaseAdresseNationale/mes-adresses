import { Pane, Heading, Text } from "evergreen-ui";

import StarRating from "./star-rating";
import { AccordionCard } from "@/components/accordion-card";
import { useContext, useMemo, useState } from "react";
import AchievementBadge from "../achievements-badge/achievements-badge";
import Counter from "@/components/counter";
import BalDataContext from "@/contexts/bal-data";
import { Alert } from "@/lib/openapi-api-bal";

interface QualityGoalProps {}

function QualityGoal({}: QualityGoalProps) {
  const [isActive, setIsActive] = useState(false);
  const { alerts } = useContext(BalDataContext);

  const nbErrors = useMemo(
    () => alerts.filter((alert) => alert.severity === Alert.severity.E).length,
    [alerts]
  );
  const nbWarnings = useMemo(
    () => alerts.filter((alert) => alert.severity === Alert.severity.W).length,
    [alerts]
  );
  const nbInfos = useMemo(
    () => alerts.filter((alert) => alert.severity === Alert.severity.I).length,
    [alerts]
  );
  const rate = useMemo(() => {
    if (nbErrors > 0) return 0;
    else if (nbWarnings > 2 && nbErrors === 0) return 2;
    else if (nbWarnings <= 2 && nbErrors === 0) return 3;
    else if (nbInfos > 2 && nbWarnings === 0 && nbErrors === 0) return 4;
    return 5;
  }, [nbErrors, nbWarnings, nbInfos]);
  const isCompleted = rate === 5;

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane display="flex" alignItems="center" gap={16}>
              <AchievementBadge
                icone="/static/images/achievements/fiabilite.svg"
                title="Publication"
                completed={isCompleted}
              />
              <Heading color={isCompleted && "#317159"}>Qualité</Heading>
            </Pane>
            <Pane width="100%">
              <StarRating value={rate} />
              <Pane display="flex" justifyContent="center" alignItems="center">
                <Counter
                  label="Erreurs détectées"
                  value={nbErrors}
                  color="red"
                />
                <Counter
                  label="Avertissements détectés"
                  value={nbWarnings}
                  color="orange"
                />
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
            Locale. Elles sont classées en erreurs et avertissements.
            <br />
            Pour garantir la qualité de votre Base Adresse Locale, il est
            important de corriger les alertes.
            <br />
            <br />
            Les erreurs sont des alertes qui doivent être corrigées avant la
            publication de votre Base Adresse Locale.
            <br />
            Les avertissements sont des alertes qui peuvent être corrigées après
            la publication de votre Base Adresse Locale.
          </Text>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default QualityGoal;
