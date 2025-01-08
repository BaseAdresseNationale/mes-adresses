import React, { useContext } from "react";
import { EditIcon, Heading, Pane, Text } from "evergreen-ui";

import { BaseLocale, ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";
import LanguagePreview from "../bal/language-preview";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";

interface HeaderSideBarProps {
  baseLocale: BaseLocale;
  commune: CommuneType;
  voies: ExtendedVoieDTO[];
  openForm: () => void;
}

function HeaderSideBar({
  baseLocale,
  commune,
  voies,
  openForm,
}: HeaderSideBarProps) {
  const { token } = useContext(TokenContext);
  const { editingId, isEditing, numeros } = useContext(BalDataContext);
  return (
    <Pane display="flex" flexDirection="column" background="tint1" padding={16}>
      <Heading>
        {commune.nom} - {commune.code}
        {!isEditing && token && (
          <EditIcon
            marginBottom={-2}
            marginLeft={8}
            color="black"
            onClick={openForm}
          />
        )}
      </Heading>
      {baseLocale.nomAlt && <LanguagePreview nomAlt={baseLocale.nomAlt} />}
      {voies && (
        <Text>
          {voies.length} voie{voies.length > 1 ? "s" : ""}
        </Text>
      )}
    </Pane>
  );
}

export default HeaderSideBar;
