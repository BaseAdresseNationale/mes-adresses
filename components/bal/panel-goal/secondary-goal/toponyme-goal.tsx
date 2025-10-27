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
  const hasToponymes = toponymes.length > 0;
  const isCompleted = toponymes.length > 0 && nbNumerosWithToponymes > 0;

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
                  Lieux-dits / Compléments
                </Heading>
              </Pane>
              {!hasToponymes && (
                <IconButton
                  icon={TrashIcon}
                  title="Supprimer objectif"
                  appearance="minimal"
                  intent="danger"
                  onClick={onIgnoreGoal}
                />
              )}
            </Pane>
            {hasToponymes ? (
              <Pane display="flex" justifyContent="start">
                <Counter
                  label={`lieux-dit${
                    toponymes.length > 1 ? "s" : ""
                  } / complément${toponymes.length > 1 ? "s" : ""}`}
                  value={toponymes.length}
                  color={defaultTheme.colors.orange700}
                />
                <Counter
                  label={`numéro${
                    nbNumerosWithToponymes > 1 ? "s" : ""
                  } associé${nbNumerosWithToponymes > 1 ? "s" : ""}`}
                  value={nbNumerosWithToponymes}
                  color={defaultTheme.colors.orange700}
                />
              </Pane>
            ) : (
              <Pane marginTop={16}>
                <Paragraph>
                  Enrichissez l&apos;adressage de votre commune en renseignant
                  vos lieux-dits complémentaires et voies sans adresse.
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
                  Créez un lieu-dit complémentaire ou une voie sans adresse
                  <AddIcon marginLeft={8} />
                </Button>
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
        {hasToponymes && (
          <Pane padding={8}>
            <Paragraph>
              Conservez vos noms de hameaux et lieux-dits historique.
              Associez-les aux numéros comme complément d&apos;adresse.
            </Paragraph>
          </Pane>
        )}
      </AccordionCard>
    </Pane>
  );
}

export default LangGoal;
