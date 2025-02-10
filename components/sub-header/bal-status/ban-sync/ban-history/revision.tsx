import React from "react";
import NextImage from "next/legacy/image";
import { Pane, Text, StatusIndicator, Strong, Badge } from "evergreen-ui";

import RevisionUser from "@/components/sub-header/bal-status/ban-sync/ban-history/revision-user";
import { CommuneType } from "@/types/commune";
import { Revision as RevisionType } from "@/lib/api-depot/types";

function getIndicatorColor(isCurrent, isUserBAL) {
  if (isCurrent) {
    return isUserBAL ? "success" : "danger";
  }

  return "disabled";
}

interface RevisionProps {
  baseLocaleId: string;
  commune: CommuneType;
  revision: RevisionType;
}

function Revision({ baseLocaleId, commune, revision }: RevisionProps) {
  const isUserBAL = revision.context.extras?.balId === baseLocaleId;
  const indicatorColor = getIndicatorColor(revision.isCurrent, isUserBAL);

  return (
    <Pane
      display="grid"
      gridTemplateColumns="10px 75px max-content max-content 24px"
      alignItems="center"
      gap={8}
    >
      <StatusIndicator color={indicatorColor} />

      <Badge>{new Date(revision.publishedAt).toLocaleDateString()}</Badge>

      <RevisionUser
        context={revision.context}
        habilitation={(revision as any).habilitation}
        communeName={commune.nom}
      />

      <Pane>
        {revision.client?.nom && (
          <Text>
            via <Strong>{revision.client.nom}</Strong>
          </Text>
        )}
      </Pane>

      <Pane display="flex" alignItems="center">
        {isUserBAL && (
          <NextImage
            src="/static/images/ban-logo.png"
            alt="Logo Base Adresses Nationale"
            width={24}
            height={24}
          />
        )}
      </Pane>
    </Pane>
  );
}

export default React.memo(Revision);
