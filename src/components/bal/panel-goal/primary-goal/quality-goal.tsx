import { useContext, useMemo } from "react";
import {
  Pane,
  Heading,
  Text,
  Button,
  EyeOpenIcon,
  defaultTheme,
  Link,
  MenuIcon,
} from "evergreen-ui";

import { AccordionCard } from "@/components/accordion-card";
import { useState } from "react";
import AchievementBadge from "../achievements-badge/achievements-badge";
import Counter from "@/components/counter";
import AlertsContext from "@/contexts/alerts";
import { useRouter } from "next/navigation";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import DrawerContext from "@/contexts/drawer";

interface QualityGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function QualityGoal({ baseLocale }: QualityGoalProps) {
  const { isMobile } = useContext(LayoutContext);
  const { setDrawerDisplayed } = useContext(DrawerContext);
  const [isActive, setIsActive] = useState(false);
  const { voiesAlerts, numerosAlerts } = useContext(AlertsContext);
  const router = useRouter();

  const goToAlerts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    void router.push(`/bal/${baseLocale.id}/voies?filter=with-suggestions`);
  };

  const nbAlerts = useMemo(() => {
    const nbVoiesAlerts =
      Object.values(voiesAlerts)?.reduce((acc, current) => [...acc, ...current])
        .length || 0;

    const nbNumerosAlerts =
      Object.values(numerosAlerts)?.reduce((acc, current) => [
        ...acc,
        ...current,
      ]).length || 0;

    return nbVoiesAlerts + nbNumerosAlerts;
  }, [voiesAlerts, numerosAlerts]);

  const isAllCorrected = useMemo(() => {
    return nbAlerts === 0;
  }, [nbAlerts]);

  const colorCard = useMemo(() => {
    if (nbAlerts === 0) {
      return defaultTheme.colors.green100;
    }
    return defaultTheme.colors.white;
  }, [nbAlerts]);

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane display="flex" alignItems="center" gap={16}>
              <AchievementBadge
                icone="/static/images/achievements/fiabilite.svg"
                title="Publication"
                completed={isAllCorrected}
              />
              <Heading color={isAllCorrected && "#317159"}>
                Fiabilisation
              </Heading>
            </Pane>

            {nbAlerts > 0 ? (
              <Pane
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Counter
                  label="Suggestions proposé"
                  value={nbAlerts}
                  color={defaultTheme.colors.purple600}
                />

                <Button
                  width="100%"
                  style={{
                    backgroundColor: defaultTheme.colors.purple600,
                    color: "white",
                  }}
                  iconAfter={EyeOpenIcon}
                  title="Voir les alertes"
                  onClick={(e) => goToAlerts(e)}
                >
                  Voir les suggestions
                </Button>
              </Pane>
            ) : null}
          </Pane>
        }
        backgroundColor={colorCard}
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        <Pane padding={8} marginBottom={16}>
          <Text>
            Pour vous aider dans la fiabilisation des adresses, profitez de
            suggestions d&apos;améliorations en un clic.
            <br />
            <br />
            Ces suggestions sont tirées du{" "}
            <Link
              target="_blank"
              href={`https://doc.adresse.data.gouv.fr/docs/bonnes-pratiques/a-propos-du-guide-des-bonnes-pratiques`}
            >
              Guide des Bonnes Pratiques
            </Link>{" "}
            et paramétrables depuis le{" "}
            <Button
              onClick={() => setDrawerDisplayed(true)}
              {...(!isMobile && {
                iconAfter: MenuIcon,
                marginRight: 16,
                height: 24,
              })}
            >
              {isMobile ? <MenuIcon /> : "Menu"}
            </Button>
          </Text>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default QualityGoal;
