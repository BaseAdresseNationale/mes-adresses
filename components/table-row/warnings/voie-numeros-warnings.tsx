import { Pane, Text, Button, WarningSignIcon } from "evergreen-ui";
import NextLink from "next/link";

import { ExtendedBaseLocaleDTO, ExtendedVoieDTO } from "@/lib/openapi-api-bal";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";

interface VoieNomWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  voie: ExtendedVoieDTO;
}

function VoieNumerosWarning({ baseLocale, voie }: VoieNomWarningProps) {
  return (
    <>
      <Pane marginBottom={8}>
        <WarningSignIcon
          color="white"
          style={{ verticalAlign: "middle" }}
          marginRight={4}
        />
        <Text color="white">Un ou plusieurs numéros ont des alertes</Text>
      </Pane>
      <Button
        is={NextLink}
        href={`/bal/${baseLocale.id}/${TabsEnum.VOIES}/${voie.id}/numeros`}
        title="Voir les numeros de la voie"
        size="small"
      >
        Voir
      </Button>
    </>
  );
}

export default VoieNumerosWarning;
