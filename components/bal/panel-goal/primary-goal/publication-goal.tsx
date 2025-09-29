import { useMemo, useState, useContext } from "react";
import { Pane, Heading, Button, Paragraph, defaultTheme } from "evergreen-ui";

import usePublishProcess from "@/hooks/publish-process";
import { CommuneType } from "@/types/commune";
import { ExtendedBaseLocaleDTO, HabilitationDTO } from "@/lib/openapi-api-bal";
import AchievementBadge from "../achievements-badge/achievements-badge";
import { AccordionCard } from "@/components/accordion-card";
import BalDataContext from "@/contexts/bal-data";

interface PublicationGoalProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
}

function PublicationGoal({ commune, baseLocale }: PublicationGoalProps) {
  const { handleShowHabilitationProcess } = usePublishProcess(commune);
  const { habilitation } = useContext(BalDataContext);
  const [isActive, setIsActive] = useState(
    baseLocale.status === ExtendedBaseLocaleDTO.status.DRAFT
  );

  const handlePublication = (e) => {
    e.stopPropagation();
    handleShowHabilitationProcess();
  };
  const isCompleted = useMemo(() => {
    return (
      baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
      habilitation?.status === HabilitationDTO.status.ACCEPTED
    );
  }, [baseLocale.status, habilitation?.status]);

  const colorCard = useMemo(() => {
    if (baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED) {
      return defaultTheme.colors.redTint;
    } else if (baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED) {
      if (habilitation?.status === HabilitationDTO.status.ACCEPTED) {
        return defaultTheme.colors.green100;
      } else {
        return defaultTheme.colors.yellow100;
      }
    }
    return defaultTheme.colors.white;
  }, [baseLocale.status, habilitation?.status]);

  return (
    <Pane paddingX={8}>
      <AccordionCard
        title={
          <Pane display="flex" alignItems="center" gap={16} paddingLeft={8}>
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title="Publication"
              completed={isCompleted}
            />
            <Heading color={isCompleted && defaultTheme.colors.green700}>
              Publication
            </Heading>
          </Pane>
        }
        backgroundColor={colorCard}
        isActive={isActive}
        onClick={() => setIsActive(!isActive)}
        caretPosition="start"
      >
        <Pane padding={8}>
          {baseLocale.status === ExtendedBaseLocaleDTO.status.DRAFT && (
            <Paragraph>
              Afin d&apos;être synchronisée avec la Base d&apos;Adresse
              Nationnale, cette Base Adresse Locale doit être publiée par la
              commune de {commune.nom}.
              <br />
              Notez qu&apos;une une fois publiée, toutes les modifications
              remonteront automatiquement dans la Base Adresse Nationale.
              <Pane display="flex" justifyContent="right">
                <Button
                  appearance="primary"
                  onClick={(e) => handlePublication(e)}
                  textAlign="center"
                >
                  Publier
                </Button>
              </Pane>
            </Paragraph>
          )}
          {baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
            habilitation.status === HabilitationDTO.status.ACCEPTED && (
              <Paragraph>
                Toutes les modifications remonteront automatiquement dans la
                Base Adresse Nationale
              </Paragraph>
            )}
          {baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
            habilitation.status !== HabilitationDTO.status.ACCEPTED && (
              <Paragraph display="flex" flexDirection="column" gap={8}>
                Votre habilitation n&apos;est plus valide, veuillez la
                renouveler
                <Pane display="flex" justifyContent="right">
                  <Button
                    marginRight={8}
                    height={24}
                    appearance="primary"
                    onClick={handleShowHabilitationProcess}
                  >
                    Habiliter la BAL
                  </Button>
                </Pane>
              </Paragraph>
            )}
          {baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED && (
            <Pane>
              <Paragraph color={defaultTheme.colors.red700}>
                La Base Adresse Locale a été remplacée par une autre, une autre
                Base Adresses Locale est synchronisée avec la Base Adresse
                Nationale.
              </Paragraph>
              <Paragraph>
                Veuillez entrer en contact les administrateurs de l’autre Base
                Adresse Locale ou notre support: adresse@data.gouv.fr
              </Paragraph>
            </Pane>
          )}
        </Pane>
      </AccordionCard>
    </Pane>
  );
}

export default PublicationGoal;
