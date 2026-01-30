/* eslint-disable react-hooks/purity */
import {
  Alert,
  LockIcon,
  Pane,
  Paragraph,
  Tooltip,
  UnlockIcon,
} from "evergreen-ui";
import SignalementTypeBadge from "./signalement-type-badge";
import { Signalement, Source } from "@/lib/openapi-signalement";
import { getDuration, getLongFormattedDate } from "@/lib/utils/date";

interface SignalementHeaderProps {
  signalement: Signalement;
  author?: Signalement["author"];
}

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

export function SignalementHeader({
  signalement,
  author,
}: SignalementHeaderProps) {
  const {
    type,
    createdAt,
    source,
    changesRequested,
    status,
    updatedAt,
    rejectionReason,
  } = signalement;

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
          {source.type === Source.type.PRIVATE ? (
            <Tooltip content="Ce signalement provient d'un acteur de confiance">
              <LockIcon marginLeft={5} color="success" />
            </Tooltip>
          ) : (
            <Tooltip content="Ce signalement provient d'une source grand public">
              <UnlockIcon marginLeft={5} color="muted" />
            </Tooltip>
          )}
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
          <>
            <Paragraph marginTop={10}>
              Vous avez refusé cette proposition le{" "}
              <b>{getLongFormattedDate(new Date(updatedAt))}</b>
            </Paragraph>

            {rejectionReason && (
              <Paragraph marginTop={10}>
                Raison : <b>{rejectionReason}</b>
              </Paragraph>
            )}
          </>
        )}
      </Pane>
    </Alert>
  );
}
