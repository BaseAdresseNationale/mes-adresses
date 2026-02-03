import { useContext } from "react";
import { Pane, Heading, EditIcon, Text, IconButton } from "evergreen-ui";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import LanguagePreview from "../bal/language-preview";
import { ExtendedBaseLocaleDTO, Toponyme } from "@/lib/openapi-api-bal";
import { TabsEnum } from "../sidebar/main-tabs/main-tabs";
import NextLink from "next/link";

interface ToponymeHeadingProps {
  toponyme: Toponyme;
  baseLocale: ExtendedBaseLocaleDTO;
}

function ToponymeHeading({ toponyme, baseLocale }: ToponymeHeadingProps) {
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
            {toponyme.nom}
            {token && (
              <IconButton
                is={NextLink}
                href={`/bal/${baseLocale.id}/${TabsEnum.TOPONYMES}/${toponyme.id}`}
                title="Éditer le toponyme"
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
        </Pane>
        {toponyme.nomAlt && <LanguagePreview nomsAlt={toponyme.nomAlt} />}
      </Heading>
    </Pane>
  );
}

export default ToponymeHeading;
