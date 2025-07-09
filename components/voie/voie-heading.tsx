import { useContext } from "react";
import { Pane, Heading, EditIcon, Text, IconButton } from "evergreen-ui";
import NextLink from "next/link";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import LanguagePreview from "../bal/language-preview";
import { ExtendedBaseLocaleDTO, Voie } from "@/lib/openapi-api-bal";
import { TabsEnum } from "../sidebar/main-tabs/main-tabs";

interface VoieHeadingProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: Voie;
}

function VoieHeading({ voie, baseLocale }: VoieHeadingProps) {
  const { token } = useContext(TokenContext);
  const { numeros } = useContext(BalDataContext);

  return (
    <Pane display="flex" flexDirection="column" background="white" padding={16}>
      <Heading>
        <Pane
          marginBottom={8}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            {voie.nom}
            {token && (
              <IconButton
                is={NextLink}
                href={`/bal/${baseLocale.id}/${TabsEnum.VOIES}/${voie.id}`}
                title="Éditer la voie"
                icon={EditIcon}
                marginBottom={-2}
                marginLeft={8}
              />
            )}
          </Pane>
          {numeros && (
            <Text padding={0}>
              {numeros.length} numéro{numeros.length > 1 ? "s" : ""}
            </Text>
          )}
          {voie.comment && (
            <Text color="gray" fontStyle="italic">
              {voie.comment}
            </Text>
          )}
        </Pane>
        {voie.nomAlt && <LanguagePreview nomsAlt={voie.nomAlt} />}
      </Heading>
    </Pane>
  );
}

export default VoieHeading;
