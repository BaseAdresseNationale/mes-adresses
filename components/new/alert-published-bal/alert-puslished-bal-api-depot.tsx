import { useMemo } from "react";
import { Pane, Paragraph, Strong } from "evergreen-ui";

import { Client, Revision } from "@/lib/api-depot/types";

interface AlertAlertPublishedBALApiDepotProps {
  revision: Revision;
}

function AlertPublishedBALApiDepot({
  revision,
}: AlertAlertPublishedBALApiDepotProps) {

  const client: Client = useMemo(() => {
    return revision.client as Client
  }, [revision])

  return (
    <Pane>
      <Paragraph marginTop={16}>
        Une Base Adresse Locale est déjà déposée par <Strong>{client.chefDeFile}</Strong>. En
        cas de doute, merci de prendre attache auprès de cet organisme en
        contactant : <Strong>{client.chefDeFileEmailContact}</Strong>
      </Paragraph>
      <Paragraph marginTop={16}>
        La commune reste toutefois l’autorité compétente en matière d’adressage,
        et vous pouvez décider à tout moment de reprendre la main sur la
        publication de votre BAL
      </Paragraph>
    </Pane>
  );
}

export default AlertPublishedBALApiDepot;
