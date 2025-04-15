import React, { useContext } from "react";
import {
  Button,
  EditIcon,
  Heading,
  IconButton,
  Pane,
  Text,
} from "evergreen-ui";

import { BaseLocale, ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import LanguagePreview from "../bal/language-preview";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import { CommuneType } from "@/types/commune";

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
          <IconButton
            icon={EditIcon}
            marginTop={-4}
            size="large"
            appearance="minimal"
            onClick={openForm}
          />
        )}
      </Heading>
      {baseLocale.communeNomsAlt && (
        <LanguagePreview nomAlt={baseLocale.communeNomsAlt} />
      )}
      {voies && (
        <Text>
          {voies.length} voie{voies.length > 1 ? "s" : ""}
        </Text>
      )}
    </Pane>
  );
}

export default HeaderSideBar;
