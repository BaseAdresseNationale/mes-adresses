import {
  Pane,
  Heading,
  Paragraph,
  defaultTheme,
  AddIcon,
  Button,
  IconButton,
  TrashIcon,
} from "evergreen-ui";
import NextLink from "next/link";
import { useContext, useState } from "react";

import BalDataContext from "@/contexts/bal-data";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { AccordionCard } from "@/components/accordion-card";
import AchievementBadge from "../achievements-badge/achievements-badge";
import Counter from "@/components/counter";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";

interface LangGoalProps {
  baseLocale: ExtendedBaseLocaleDTO;
  onIgnoreGoal: () => void;
}

function LangGoal({ baseLocale, onIgnoreGoal }: LangGoalProps) {
  const [isActive, setIsActive] = useState(false);
  const { toponymes } = useContext(BalDataContext);

  const nbNumerosWithToponymes = toponymes.reduce(
    (acc, toponyme) => acc + toponyme.nbNumeros,
    0
  );
  const isCompleted = toponymes.length > 0 && nbNumerosWithToponymes > 0;
  const {
    settings: { toponymeGoalAccepted },
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
                  icone="/static/images/achievements/panneau-directionnel.png"
                  title="Publication"
                  completed={isCompleted}
                />
                <Heading color={isCompleted && defaultTheme.colors.green700}>
                  Lieux-dits / Complément
                </Heading>
              </Pane>
              {toponymeGoalAccepted === null && (
                <IconButton
                  icon={TrashIcon}
                  title="Ajouter un toponyme"
                  appearance="minimal"
                  intent="danger"
                  onClick={onIgnoreGoal}
                />
              )}
            </Pane>
            {toponymeGoalAccepted === null && (
              <Pane marginTop={16}>
                <Paragraph>
                  Pour activer l&apos;objectif, il faut créer votre premier
                  toponyme
                </Paragraph>
                <Button
                  marginTop={16}
                  title="Ajouter un toponyme"
                  is={NextLink}
                  appearance="primary"
                  intent="success"
                  href={`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/new`}
                  width="100%"
                >
                  Créer Toponyme
                  <AddIcon marginLeft={8} />
                </Button>
              </Pane>
            )}
            {toponymeGoalAccepted === true && (
              <Pane display="flex" justifyContent="start">
                <Counter
                  label="Toponyme(s)"
                  value={toponymes.length}
                  color={defaultTheme.colors.orange700}
                />
                <Counter
                  label="Numéro(s) relié(s)"
                  value={nbNumerosWithToponymes}
                  color={defaultTheme.colors.orange700}
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
        {toponymeGoalAccepted === true && (
          <Pane padding={8}>
            <Paragraph>
              Il est important de remplir les lieux-dits et complément de votre
              commune dans l&apos;onglet toponyme.
            </Paragraph>
            <Paragraph>
              Vous pouvez les relier à des numéros pour les localiser
            </Paragraph>
          </Pane>
        )}
      </AccordionCard>
    </Pane>
  );
}

export default LangGoal;
