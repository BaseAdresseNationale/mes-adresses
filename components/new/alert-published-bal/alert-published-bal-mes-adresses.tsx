import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { Alert, Button, Pane, Paragraph } from "evergreen-ui";
import NextLink from "next/link";
import NextImage from "next/image";

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
    <Alert
      intent="success"
      hasIcon={false}
      title={
        <Pane display="flex" alignItems="center">
          <Pane position="relative" width={24} height={24}>
            <NextImage
              src="/static/images/published-bal-icon.svg"
              alt="Icone Base Adresse Locale publiée"
              layout="fill"
            />
          </Pane>
          <span style={{ marginLeft: 10 }}>
            Base Adresse Locale déjà publiée
          </span>
        </Pane>
      }
    >
      <Pane marginLeft={35}>
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
      </Pane>
    </Alert>
  );
}

export default AlertPublishedBALMesAdresses;
