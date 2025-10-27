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
import languesRegionales from "@ban-team/shared-data/langues-regionales.json";

import BalDataContext from "@/contexts/bal-data";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { AccordionCard } from "@/components/accordion-card";
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
  const nbWithLang = nbVoiesWithLang + nbToponymesWithLang;
  const isCompleted = nbWithLang > 0;
  const hasLangRegional = baseLocale.communeNomsAlt || isCompleted;
  const langueRegional =
    baseLocale.communeNomsAlt &&
    languesRegionales.find(
      (lr) => lr.code === Object.keys(baseLocale.communeNomsAlt)[0]
    )?.label;
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
              {!hasLangRegional && (
                <IconButton
                  icon={TrashIcon}
                  title="poubelle icon"
                  appearance="minimal"
                  intent="danger"
                  onClick={onIgnoreGoal}
                />
              )}
            </Pane>
            {hasLangRegional ? (
              <Pane display="flex" justifyContent="center">
                <Counter
                  label="voies, places et lieux-dits multilingues"
                  value={nbWithLang}
                  color={defaultTheme.colors.blue700}
                />
              </Pane>
            ) : (
              <Pane marginTop={16}>
                <Paragraph>
                  Pour un adressage multilingue, commencez par renseigner le nom
                  de la commune en langue régional
                </Paragraph>
                <Button
                  marginTop={16}
                  title="Modifier langue régionale a la commune"
                  appearance="primary"
                  intent="success"
                  width="100%"
                  onClick={onEditNomsAlt}
                >
                  Modifier le nom de la commune <EditIcon marginLeft={8} />
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
        {hasLangRegional && (
          <Pane padding={8}>
            <Paragraph marginBottom={8}>
              Mettez en valeur votre patrimoine linguistique en renseignant vos
              libellés de voies, places et lieux-dits
              {langueRegional && ` en ${langueRegional}`}
            </Paragraph>
          </Pane>
        )}
      </AccordionCard>
    </Pane>
  );
}

export default LangGoal;
