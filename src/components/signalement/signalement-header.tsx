/* eslint-disable react-hooks/purity */
import { Alert as AlertUI, Pane, Paragraph, Tooltip } from "evergreen-ui";
import SignalementTypeBadge from "./signalement-type-badge";
import { Alert, Signalement, Source } from "@/lib/openapi-signalement";
import { getDuration, getLongFormattedDate } from "@/lib/utils/date";
import Image from "next/image";

interface SignalementHeaderProps {
  signalement: Signalement | Alert;
  author?: Signalement["author"];
}

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

function getComment(signalement: Signalement | Alert): string | undefined {
  if ("changesRequested" in signalement) {
    return (signalement as Signalement).changesRequested.comment;
  }

  return (signalement as Alert).comment;
}

export function SignalementHeader({
  signalement,
  author,
}: SignalementHeaderProps) {
  const { type, createdAt, source, status, updatedAt } = signalement;
  const rejectionReason =
    "rejectionReason" in signalement ? signalement.rejectionReason : undefined;
  const comment = getComment(signalement);

  return (
    <AlertUI
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
              <Image
                src="/static/images/signalement/source-service-public.svg"
                alt="Icône source service public"
                width={20}
                height={20}
                style={{
                  marginLeft: 5,
                  verticalAlign: "sub",
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip content="Ce signalement provient d'une source grand public">
              <Image
                src="/static/images/signalement/source-grand-public.svg"
                alt="Icône source grand public"
                width={20}
                height={20}
                style={{
                  marginLeft: 5,
                  verticalAlign: "middle",
                }}
              />
            </Tooltip>
          )}
        </Paragraph>

        {comment && (
          <Paragraph marginTop={10}>
            Commentaire : <b>{comment}</b>
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
    </AlertUI>
  );
}
