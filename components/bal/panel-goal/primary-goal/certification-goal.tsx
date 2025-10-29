import { useState, useContext } from "react";
import {
  Pane,
  Heading,
  Text,
  defaultTheme,
  Paragraph,
  Strong,
} from "evergreen-ui";

import ProgressBar from "@/components/progress-bar";
import Counter from "@/components/counter";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { AccordionCard } from "@/components/accordion-card";
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
          <Paragraph>
            La{" "}
            <a
              href="https://guide.mes-adresses.data.gouv.fr/publier-une-base-adresse-locale-1/certifier-ses-adresses"
              target="_blank"
              rel="noreferrer"
            >
              certification
            </a>{" "}
            vous permet de{" "}
            <Strong>suivre l&apos;avancée de la fiabilisation</Strong> des
            adresses et de <Strong>mettre en valeur votre travail</Strong>{" "}
            auprès des réutilisateurs.
          </Paragraph>
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default CertificationGoal;
