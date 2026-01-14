import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { Alert, Button, Pane, Paragraph } from "evergreen-ui";
import NextLink from "next/link";
import NextImage from "next/image";
import PublishedBALMesAdresses from "./published-bal-mes-adresses";

interface AlertPublishedBALMesAdressesProps {
  revision: Revision;
  commune: CommuneType;
}

function AlertPublishedBALMesAdresses({
  revision,
  commune,
}: AlertPublishedBALMesAdressesProps) {
  return (
    <Alert
      intent="success"
      hasIcon={false}
      title={
        <Pane display="flex" alignItems="center">
          <Pane position="relative" width={24} height={24}>
            <NextImage
              src="/static/images/published-bal-icon.svg"
              alt="Icone Base Adresse Locale publiée"
              width={24}
              height={24}
            />
          </Pane>
          <span style={{ marginLeft: 10 }}>
            Base Adresse Locale déjà publiée
          </span>
        </Pane>
      }
    >
      <PublishedBALMesAdresses revision={revision} commune={commune} />
    </Alert>
  );
}

export default AlertPublishedBALMesAdresses;
