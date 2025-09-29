import {
  Pane,
  Heading,
  Paragraph,
  defaultTheme,
  Button,
  EditIcon,
  TrashIcon,
  IconButton,
} from "evergreen-ui";
import { useContext, useState } from "react";

import BalDataContext from "@/contexts/bal-data";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { AccordionCard } from "@/components/signalement/signalement-diff/accordion-card";
import AchievementBadge from "../achievements-badge/achievements-badge";
import Counter from "@/components/counter";

interface LangGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
  onEditNomsAlt: () => void;
  onIgnoreGoal: () => void;
}

function LangGoal({ baseLocale, onEditNomsAlt, onIgnoreGoal }: LangGoalProps) {
  const [isActive, setIsActive] = useState(false);
  const { voies, toponymes } = useContext(BalDataContext);

  const nbVoiesWithLang = voies.filter((voie) => voie.nomAlt).length;
  const nbToponymesWithLang = toponymes.filter(
    (toponyme) => toponyme.nomAlt
  ).length;
  const isCompleted = nbVoiesWithLang > 0 || nbToponymesWithLang > 0;
  const {
    settings: { languageGoalAccepted },
  } = baseLocale;

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane paddingLeft={8} width="100%">
            <Pane
              display="flex"
              alignItems="center"
              gap={16}
              justifyContent="space-between"
            >
              <Pane display="flex" alignItems="center" gap={16}>
                <AchievementBadge
                  icone="/static/images/achievements/regional-language.svg"
                  title="Logo Langue Régionale"
                  completed={isCompleted}
                />
                <Heading color={isCompleted && defaultTheme.colors.green700}>
                  Langue Régionale
                </Heading>
              </Pane>
              <IconButton
                icon={TrashIcon}
                title="Ajouter un toponyme"
                appearance="minimal"
                intent="danger"
                onClick={onIgnoreGoal}
              />
            </Pane>
            {languageGoalAccepted === null && (
              <Pane marginTop={16}>
                <Paragraph>
                  Pour activer l&apos;objectif, il faut ajouter une langue
                  régionale à la commune, une voie ou un toponyme.
                </Paragraph>
                <Button
                  marginTop={16}
                  title="Modifier langue régionale a la commune"
                  appearance="primary"
                  intent="success"
                  width="100%"
                  onClick={onEditNomsAlt}
                >
                  Modifier langue de la commune <EditIcon marginLeft={8} />
                </Button>
              </Pane>
            )}
            {languageGoalAccepted === true && (
              <Pane display="flex" justifyContent="center">
                <Counter
                  label="voie(s) régionales"
                  value={nbVoiesWithLang}
                  color={defaultTheme.colors.blue700}
                />
                <Counter
                  label="toponyme(s) régionales"
                  value={nbToponymesWithLang}
                  color={defaultTheme.colors.blue700}
                />
              </Pane>
            )}
          </Pane>
        }
        backgroundColor={
          isCompleted ? defaultTheme.colors.green100 : defaultTheme.colors.white
        }
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        {languageGoalAccepted === true && (
          <Pane padding={8}>
            <Paragraph marginBottom={8}>
              Afin d&apos;améliorer la qualité de votre Base Adresse Locale, il
              est important de remplir les champs de langue régionale.
            </Paragraph>
            <Paragraph>
              Vous pouvez remplir le champ de langue régionale pour chaque voie
              et toponyme mais aussi pour la commune.
            </Paragraph>
          </Pane>
        )}
      </AccordionCard>
    </Pane>
  );
}

export default LangGoal;
