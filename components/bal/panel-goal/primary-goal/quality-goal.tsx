import { useContext } from "react";
import { Pane, Heading, Text, Button, EyeOpenIcon } from "evergreen-ui";

import { AccordionCard } from "@/components/accordion-card";
import { useState } from "react";
import AchievementBadge from "../achievements-badge/achievements-badge";
import Counter from "@/components/counter";
import AlertsContext from "@/contexts/alerts";
import { useRouter } from "next/router";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface QualityGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function QualityGoal({ baseLocale }: QualityGoalProps) {
  const [isActive, setIsActive] = useState(false);
  const { voiesAlerts } = useContext(AlertsContext);
  const router = useRouter();

  const goToAlerts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    void router.push({
      pathname: `/bal/${baseLocale.id}/voies`,
      query: { filters: ["alertes"] },
    });
  };

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
                completed={Object.values(voiesAlerts).length === 0}
              />
              <Heading color={isAllCertified && "#317159"}>Qualité</Heading>
            </Pane>
            <Pane
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Counter
                label="Avertissements détectés"
                value={Object.values(voiesAlerts).length}
                color="orange"
              />
              <Button
                width="100%"
                appearance="primary"
                iconAfter={EyeOpenIcon}
                title="Voir les alertes"
                onClick={(e) => goToAlerts(e)}
              >
                Voir les alertes
              </Button>
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
