import { Revision } from "@/lib/api-depot/types";
import { CommuneType } from "@/types/commune";
import { Button, Pane, Paragraph } from "evergreen-ui";
import NextLink from "next/link";

interface PublishedBALMesAdressesProps {
  revision: Revision;
  commune: CommuneType;
  buttonPosition?: "left" | "right";
}

function PublishedBALMesAdresses({
  revision,
  commune,
  buttonPosition = "left",
}: PublishedBALMesAdressesProps) {
  const publishedBALId = revision.context?.extras?.balId || null;

  return (
    <Pane marginLeft={35}>
      <Paragraph marginTop={8}>
        Une Base Adresse Locale est déjà publiée pour {commune.nom}.
      </Paragraph>
      <Paragraph marginTop={8}>
        Si vous en êtes l&apos;administrateur, nous vous recommendons de
        poursuivre l’adressage depuis cette dernière.
      </Paragraph>
      <Pane
        display="flex"
        justifyContent={buttonPosition === "left" ? "start" : "end"}
      >
        <Button
          marginTop={8}
          appearance="primary"
          is={NextLink}
          height={30}
          target="_blank"
          href={`${process.env.NEXT_PUBLIC_EDITEUR_URL}/bal/${publishedBALId}`}
        >
          Accéder à la Base Adresse Locale publiée
        </Button>
      </Pane>
    </Pane>
  );
}

export default PublishedBALMesAdresses;
