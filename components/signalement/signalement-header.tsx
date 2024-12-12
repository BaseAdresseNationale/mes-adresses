import { Alert, Pane, Paragraph } from "evergreen-ui";
import SignalementTypeBadge from "./signalement-type-badge";
import { Signalement } from "@/lib/openapi-signalement";
import { getDuration } from "@/lib/utils/date";
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
  const {
    type,
    createdAt,
    source,
    changesRequested,
    status,
    processedBy,
    updatedAt,
  } = signalement;

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
            Déposée le <b>{new Date(createdAt).toLocaleDateString()}</b>{" "}
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
            <b>Commentaire : </b>
            {changesRequested.comment}
          </Paragraph>
        )}

        {status === Signalement.status.PROCESSED && (
          <>
            <Paragraph marginTop={10}>
              Acceptée le <b>{new Date(updatedAt).toLocaleDateString()}</b>
            </Paragraph>
            <Paragraph>
              via <b>{processedBy.nom}</b>
            </Paragraph>
          </>
        )}

        {status === Signalement.status.IGNORED && (
          <>
            <Paragraph marginTop={10}>
              Refusée le <b>{new Date(updatedAt).toLocaleDateString()}</b>
            </Paragraph>
            <Paragraph>
              via <b>{processedBy.nom}</b>
            </Paragraph>
          </>
        )}
      </Pane>
    </Alert>
  );
}
