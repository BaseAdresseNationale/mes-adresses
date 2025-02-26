import { Alert, Pane, Paragraph } from "evergreen-ui";
import SignalementTypeBadge from "./signalement-type-badge";
import { Signalement } from "@/lib/openapi-signalement";
import { getDuration, getLongFormattedDate } from "@/lib/utils/date";
import {
  ExtendedBaseLocaleDTO,
  SignalementsService as SignalementsServiceBal,
} from "@/lib/openapi-api-bal";
import { useEffect, useState } from "react";

interface SignalementHeaderProps {
  signalement: Signalement;
  baseLocale: ExtendedBaseLocaleDTO;
}

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

export function SignalementHeader({
  signalement,
  baseLocale,
}: SignalementHeaderProps) {
  const [author, setAuthor] = useState<Signalement["author"]>();
  const { type, createdAt, source, changesRequested, status, updatedAt } =
    signalement;

  useEffect(() => {
    const fetchAuthor = async () => {
      const author = await SignalementsServiceBal.getAuthor(
        signalement.id,
        baseLocale.id
      );
      setAuthor(author);
    };

    fetchAuthor();
  }, [signalement, baseLocale]);

  return (
    <Alert
      hasIcon={false}
      title={<SignalementTypeBadge type={type} />}
      intent="info"
      padding={8}
      borderRadius={8}
      marginBottom={8}
      width="100%"
      flexShrink={0}
    >
      <Pane marginTop={8}>
        {Date.now() - new Date(createdAt).getTime() > MONTH_IN_MS ? (
          <Paragraph>
            Déposée le <b>{getLongFormattedDate(new Date(createdAt))}</b>{" "}
          </Paragraph>
        ) : (
          <Paragraph>
            Déposée il y a <b>{getDuration(new Date(createdAt))}</b>{" "}
          </Paragraph>
        )}
        {author && (
          <Paragraph>
            par{" "}
            <b>
              {author.firstName} {author.lastName}
            </b>{" "}
            {author.email && (
              <a href={`mailto:${author.email}`}>{author.email}</a>
            )}
          </Paragraph>
        )}
        <Paragraph>
          via <b>{source.nom}</b>
        </Paragraph>

        {changesRequested.comment && (
          <Paragraph marginTop={10}>
            Commentaire : <b>{changesRequested.comment}</b>
          </Paragraph>
        )}

        {status === Signalement.status.PROCESSED && (
          <Paragraph marginTop={10}>
            Vous avez accepté cette proposition le{" "}
            <b>{getLongFormattedDate(new Date(updatedAt))}</b>
          </Paragraph>
        )}

        {status === Signalement.status.IGNORED && (
          <Paragraph marginTop={10}>
            Vous avez refusé cette proposition le{" "}
            <b>{getLongFormattedDate(new Date(updatedAt))}</b>
          </Paragraph>
        )}
      </Pane>
    </Alert>
  );
}
