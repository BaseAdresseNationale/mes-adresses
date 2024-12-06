import { Alert, Pane, Paragraph } from "evergreen-ui";
import SignalementTypeBadge from "./signalement-type-badge";
import { Signalement } from "@/lib/openapi-signalement";
import { getDuration } from "@/lib/utils/date";

interface SignalementHeaderProps {
  signalement: Signalement;
}

const MONTH_IN_MS = 1000 * 60 * 60 * 24 * 30;

export function SignalementHeader({ signalement }: SignalementHeaderProps) {
  return (
    <Alert
      title={<SignalementTypeBadge type={signalement.type} />}
      intent="info"
      padding={8}
      borderRadius={8}
      marginBottom={8}
      width="100%"
      flexShrink={0}
    >
      <Pane marginTop={8}>
        {Date.now() - new Date(signalement.createdAt).getTime() >
        MONTH_IN_MS ? (
          <Paragraph>
            Déposée le{" "}
            <b>{new Date(signalement.createdAt).toLocaleDateString()}</b>{" "}
          </Paragraph>
        ) : (
          <Paragraph>
            Déposée il y a <b>{getDuration(new Date(signalement.createdAt))}</b>{" "}
          </Paragraph>
        )}
        <Paragraph>
          via <b>{signalement.source.nom}</b>
        </Paragraph>

        {signalement.changesRequested.comment && (
          <Paragraph marginTop={10}>
            <b>Commentaire : </b>
            {signalement.changesRequested.comment}
          </Paragraph>
        )}

        {signalement.status === Signalement.status.PROCESSED && (
          <>
            <Paragraph marginTop={10}>
              Acceptée le{" "}
              <b>{new Date(signalement.updatedAt).toLocaleDateString()}</b>
            </Paragraph>
            <Paragraph>
              via <b>{signalement.processedBy.nom}</b>
            </Paragraph>
          </>
        )}

        {signalement.status === Signalement.status.IGNORED && (
          <>
            <Paragraph marginTop={10}>
              Refusée le{" "}
              <b>{new Date(signalement.updatedAt).toLocaleDateString()}</b>
            </Paragraph>
            <Paragraph>
              via <b>{signalement.processedBy.nom}</b>
            </Paragraph>
          </>
        )}
      </Pane>
    </Alert>
  );
}
