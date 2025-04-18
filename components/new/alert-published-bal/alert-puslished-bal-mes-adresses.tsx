import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { Alert, Button, Paragraph } from "evergreen-ui";
import NextLink from "next/link";

interface AlertPublishedBALMesAdressesProps {
  revision: Revision;
  commune: CommuneType;
}

function AlertPublishedBALMesAdresses({
  revision,
  commune,
}: AlertPublishedBALMesAdressesProps) {
  const publishedBALId = revision.context?.extras?.balId || null;

  return (
    <Alert title="Base Adresse Locale déjà publiée" intent="success">
      <Paragraph marginTop={8}>
        Une Base Adresse Locale est déjà publiée pour {commune.nom}.
      </Paragraph>
      <Paragraph marginTop={8}>
        Si vous en êtes l&apos;administrateur, nous vous recommendons de
        poursuivre l’adressage depuis cette dernière.
      </Paragraph>
      <Button
        marginTop={8}
        appearance="primary"
        is={NextLink}
        height={30}
        href={`/bal/${publishedBALId}`}
      >
        Accéder à la Base Adresse Locale publiée
      </Button>
    </Alert>
  );
}

export default AlertPublishedBALMesAdresses;
