import { useState, useContext } from "react";
import { Pane, Heading, Text, defaultTheme } from "evergreen-ui";

import ProgressBar from "@/components/progress-bar";
import Counter from "@/components/counter";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { AccordionCard } from "@/components/signalement/signalement-diff/accordion-card";
import AchievementBadge from "../achievements-badge/achievements-badge";
import { TilesLayerMode } from "@/components/map/layers/tiles";
import MapContext from "@/contexts/map";

interface CertificationGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
}

function CertificationGoal({ baseLocale }: CertificationGoalProps) {
  const {
    nbNumeros,
    nbNumerosCertifies,
    isAllCertified: isCompleted,
  } = baseLocale;
  const percentCertified =
    nbNumeros > 0 ? Math.floor((nbNumerosCertifies * 100) / nbNumeros) : 0;

  const [isActive, setIsActive] = useState(false);
  const { setTileLayersMode } = useContext(MapContext);

  const toggleAccordion = () => {
    const isOpen = !isActive;
    setIsActive(isOpen);
    if (isOpen) {
      setTileLayersMode(TilesLayerMode.CERTIFICATION);
    } else {
      setTileLayersMode(TilesLayerMode.VOIE);
    }
  };

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane display="flex" alignItems="center" gap={16}>
              <AchievementBadge
                icone="/static/images/achievements/100-certified.svg"
                title="Publication"
                completed={isCompleted}
              />
              <Heading color={isCompleted && defaultTheme.colors.green700}>
                Certification
              </Heading>
            </Pane>
            {!isCompleted ? (
              <Pane width="100%">
                <ProgressBar percent={percentCertified} />
                <Pane display="flex" justifyContent="center">
                  <Counter
                    label="Adresses certifiées"
                    value={nbNumerosCertifies}
                    color={defaultTheme.colors.green500}
                  />
                  <Counter
                    label="Adresses non-certifiées"
                    value={nbNumeros - nbNumerosCertifies}
                    color={defaultTheme.colors.gray500}
                  />
                </Pane>
              </Pane>
            ) : (
              <Pane marginTop={16} width="100%">
                <Text>Toutes les adresses sont certifiées par la commune</Text>
              </Pane>
            )}
          </Pane>
        }
        backgroundColor={
          isCompleted ? defaultTheme.colors.green100 : defaultTheme.colors.white
        }
        isActive={isActive}
        onClick={toggleAccordion}
        caretPosition="start"
      >
        <Pane padding={8}>
          <Heading size={400}>
            Pour faciliter la réutilisation des adresses,{" "}
            <u>il est conseillé de les certifier</u>.
          </Heading>
          <br />
          <Text>
            Il est tout à fait possible de publier une Base Adresse Locale dont
            l’ensemble des{" "}
            <u>
              numéros n’ont pas encore été vérifiés : ils doivent rester
              non-certifiés.
            </u>
            <br />
          </Text>
          <Pane paddingTop={15}>
            <Text>
              En revanche, les numéros qui auront été authentifiés par la
              commune <u>devront être certifiés</u>, qu’ils soient nouvellement
              crées par la commune ou que leur correspondance avec la liste
              officielle qui ressort du Conseil municipal, soit avérée.
            </Text>
          </Pane>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default CertificationGoal;
