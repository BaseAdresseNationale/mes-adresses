import { useContext, useMemo } from "react";
import { Pane, Heading, Button, Paragraph, EndorsedIcon } from "evergreen-ui";
import { format } from "date-fns";

import usePublishProcess from "@/hooks/publish-process";

import BalDataContext from "@/contexts/bal-data";
import { CommuneType } from "@/types/commune";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import style from "../goal-card.module.css";
import AchievementBadge from "../achievements-badge";

interface PublicationGoalProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
}

function PublicationGoal({ commune, baseLocale }: PublicationGoalProps) {
  const { habilitation, isHabilitationValid } = useContext(BalDataContext);
  const { handleShowHabilitationProcess } = usePublishProcess(commune);

  const isCompleted = useMemo(() => {
    return (
      habilitation &&
      isHabilitationValid &&
      baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED
    );
  }, [habilitation, isHabilitationValid, baseLocale.status]);

  const colorCard = useMemo(() => {
    if (baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED) {
      return "#FDF4F4";
    } else if (baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED) {
      if (habilitation && isHabilitationValid) {
        return "#DCF2EA";
      } else {
        return "#FFFAF2";
      }
    }
    return "white";
  }, [baseLocale.status, habilitation, isHabilitationValid]);

  return (
    <Pane className={style["goal-card"]} backgroundColor={colorCard}>
      <Pane display="flex" alignItems="center" gap={16} marginBottom={16}>
        <AchievementBadge
          icone="/static/images/achievements/published-bal.svg"
          title="Publication"
          completed={isCompleted}
        />
        <Heading color={isCompleted && "#317159"}>Publication</Heading>
      </Pane>
      {baseLocale.status === ExtendedBaseLocaleDTO.status.DRAFT && (
        <Paragraph marginBottom={16}>
          Afin d&apos;être synchronisée avec la Base d&apos;Adresse Nationnale,
          cette Base Adresse Locale doit être publiée par la commune de{" "}
          {commune.nom}.
          <br />
          Notez qu&apos;une une fois publiée, votre Bal sera habilitée et toutes
          les modifications remonteront automatiquement dans la Base Adresse
          Nationale.
          <Pane display="flex" justifyContent="right">
            <Button
              appearance="primary"
              onClick={handleShowHabilitationProcess}
              textAlign="center"
            >
              Publier
            </Button>
          </Pane>
        </Paragraph>
      )}
      {baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
        (!habilitation || !isHabilitationValid ? (
          <Paragraph color="#996A13">
            Votre habilitation n&apos;est plus valide, veuillez la renouveler.
            <Pane display="flex" justifyContent="right" marginTop={8}>
              <Button
                appearance="primary"
                onClick={handleShowHabilitationProcess}
                textAlign="center"
              >
                S&apos;habiliter
              </Button>
            </Pane>
          </Paragraph>
        ) : (
          <Paragraph>
            Toutes les modifications remonteront automatiquement dans la Base
            Adresse Nationale jusqu&apos;au{" "}
            <b>{format(new Date(habilitation.expiresAt), "dd/MM/yyyy")}</b>.
          </Paragraph>
        ))}
      {baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED && (
        <Pane>
          <Paragraph color="#7D2828">
            La Base Adresse Locale a été remplacée par une autre, une autre Base
            Adresses Locale est synchronisée avec la Base Adresse Nationale.
          </Paragraph>
          <Paragraph>
            Veuillez entrer en contact les administrateurs de l’autre Base
            Adresse Locale ou notre support: adresse@data.gouv.fr
          </Paragraph>
        </Pane>
      )}
    </Pane>
  );
}

export default PublicationGoal;
