import React from "react";
import { Heading, Pane, Text } from "evergreen-ui";

import { ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";

interface HeaderSideBarProps {
  commune: CommuneType;
  voies: ExtendedVoieDTO[];
}

function HeaderSideBar({ commune, voies }: HeaderSideBarProps) {
  return (
    <Pane display="flex" flexDirection="column" background="tint1" padding={16}>
      <Heading>
        {commune.nom} - {commune.code}
      </Heading>
      {voies && (
        <Text>
          {voies.length} voie{voies.length > 1 ? "s" : ""}
        </Text>
      )}
    </Pane>
  );
}

export default HeaderSideBar;
