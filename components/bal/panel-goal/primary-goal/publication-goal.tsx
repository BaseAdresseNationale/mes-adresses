import { useContext } from "react";
import { Pane, Heading, Button, Paragraph, EndorsedIcon } from "evergreen-ui";
import { format } from "date-fns";

import usePublishProcess from "@/hooks/publish-process";

import BalDataContext from "@/contexts/bal-data";
import { CommuneType } from "@/types/commune";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import style from "../goal-card.module.css";

interface PublicationGoalProps {
  commune: CommuneType;
  baseLocale: ExtendedBaseLocaleDTO;
}

function PublicationGoal({ commune, baseLocale }: PublicationGoalProps) {
  const { habilitation, isHabilitationValid } = useContext(BalDataContext);
  const { handleShowHabilitationProcess } = usePublishProcess(commune);

  return (
    <Pane
      className={style["goal-card"]}
      backgroundColor={
        baseLocale.status === ExtendedBaseLocaleDTO.status.REPLACED
          ? "#FDF4F4"
          : baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED &&
            (!habilitation || !isHabilitationValid) &&
            "#FFFAF2"
      }
    >
      <Pane display="flex" justifyContent="space-between" marginBottom={16}>
        <Heading>📤 Publication</Heading>
        {habilitation &&
          isHabilitationValid &&
          baseLocale.status === ExtendedBaseLocaleDTO.status.PUBLISHED && (
            <EndorsedIcon color="green" size={24} />
          )}
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
