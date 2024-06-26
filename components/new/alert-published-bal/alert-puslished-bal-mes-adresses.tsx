import { useMemo } from "react";
import { Revision } from "@/lib/api-depot/types";
import { Button, Pane, Paragraph } from "evergreen-ui";

interface AlertPublishedBALMesAdressesProps {
  revision: Revision;
}

function AlertPublishedBALMesAdresses({
  revision,
}: AlertPublishedBALMesAdressesProps) {
  const balId: string | null = useMemo(() => {
    return revision.context?.extras?.balId || null;
  }, [revision]);

  return (
    <Pane>
      <Paragraph marginTop={16}>
        Une Base Adresse Locale pour votre commune est déjà publiée via l’outil
        Mes Adresses.
      </Paragraph>
      <Paragraph marginTop={16}>
        Plutôt que de créer une nouvelle BAL, nous vous recommendons de
        poursuivre l’adressage depuis celle existante.
      </Paragraph>
      {balId && (
        <Paragraph marginTop={16}>
          <Button is="a" height={30} href={`/bal/${balId}`} target="_blank">
            Accéder à la Base Adresse Locale existante
          </Button>
        </Paragraph>
      )}
    </Pane>
  );
}

export default AlertPublishedBALMesAdresses;
