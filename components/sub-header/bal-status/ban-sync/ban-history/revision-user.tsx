import React from "react";
import PropTypes from "prop-types";
import { Pane, Text, Strong } from "evergreen-ui";
import { HabilitationDTO } from "@/lib/openapi";

interface RevisionUserProps {
  communeName: string;
  context: {
    nomComplet?: string;
    organisation?: string;
  };
  habilitation: HabilitationDTO;
}

function RevisionUser({
  context,
  habilitation,
  communeName,
}: RevisionUserProps) {
  let userName = context.nomComplet || context.organisation;

  if (!userName) {
    if (habilitation.strategy.type === "email") {
      userName = `mairie de ${communeName}`;
    }

    if (habilitation.strategy.type === "franceconnect") {
      userName = `élu(e) de ${communeName}`;
    }
  }

  return (
    <Pane display="flex" gap={4}>
      <Text>Par</Text>
      {userName ? (
        <Strong>{userName}</Strong>
      ) : (
        <Text fontStyle="italic">Non renseigné</Text>
      )}
    </Pane>
  );
}

export default React.memo(RevisionUser);
