import React, { useContext } from "react";
import { Heading, Pane, Text, IconButton, EditIcon } from "evergreen-ui";
import {
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  ExtentedToponymeDTO,
} from "@/lib/openapi-api-bal";
import LanguagePreview from "../bal/language-preview";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import { CommuneType } from "@/types/commune";

interface BALSummaryProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneType;
  voies: ExtendedVoieDTO[];
  toponymes: ExtentedToponymeDTO[];
  communeFlag: string;
  onEditNomsAlt: () => void;
}

function BALSummary({
  baseLocale,
  commune,
  voies,
  toponymes,
  communeFlag,
  onEditNomsAlt,
}: BALSummaryProps) {
  const { token } = useContext(TokenContext);
  const { isEditing } = useContext(BalDataContext);
  const { nbNumeros } = baseLocale;

  return (
    <Pane
      display="flex"
      flexDirection="column"
      backgroundColor="white"
      padding={16}
    >
      <Heading
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Pane display="flex" alignItems="center">
          <Pane
            height={40}
            width={40}
            flexShrink={0}
            backgroundImage={`url(${communeFlag})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="contain"
            marginRight={8}
          />
          {commune.nom} - {commune.code}
        </Pane>
        {!isEditing && token && (
          <IconButton
            icon={EditIcon}
            marginTop={-4}
            onClick={onEditNomsAlt}
            title="Modifier les noms alternatifs de la commune en langue régionale"
          />
        )}
      </Heading>
      <Pane marginLeft={40} marginY={8}>
        {baseLocale.communeNomsAlt && (
          <LanguagePreview nomsAlt={baseLocale.communeNomsAlt} />
        )}
      </Pane>
      <Pane display="flex" alignItems="center" gap={8}>
        {voies && (
          <Text>
            <b>{voies.length}</b> voie{voies.length > 1 && "s"}
          </Text>
        )}
        {toponymes && (
          <Text>
            <b>{toponymes.length}</b> toponyme{toponymes.length > 1 && "s"}
          </Text>
        )}
        <Text>
          <b>{nbNumeros}</b> numéro{nbNumeros > 1 && "s"}
        </Text>
      </Pane>
    </Pane>
  );
}

export default BALSummary;
