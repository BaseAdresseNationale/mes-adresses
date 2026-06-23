import {
  Pane,
  Heading,
  Strong,
  Text,
  Link,
  Alert,
  Paragraph,
} from "evergreen-ui";
import styles from "./button-pro-connect.module.css";

interface ProConnectProps {
  handleStrategy: () => void;
}

function ProConnect({ handleStrategy }: ProConnectProps) {
  return (
    <>
      <Pane>
        <Heading is="h5" height={30} textAlign="center">
          Via votre compte ProConnect
        </Heading>
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={16}
        marginBottom={32}
      >
        <button
          className={styles["proconnect-button"]}
          style={{ cursor: "pointer" }}
          onClick={handleStrategy}
        >
          <span className={styles["proconnect-sr-only"]}>
            S&apos;identifier avec ProConnect
          </span>
        </button>
      </Pane>
      <Alert intent="info" hasIcon={false}>
        <Paragraph marginBottom={16}>
          <Strong>
            Pour toute question, contactez notre equipe: adresse@data.gouv.fr
          </Strong>
        </Paragraph>
        <Paragraph marginBottom={4}>
          ✅ <Strong>OUI</Strong> : Vous devez utiliser le mail officiel de
          votre mairie
        </Paragraph>
        <Paragraph marginBottom={4}>
          ❌ <Strong>NON</Strong> : Vous ne pouvez pas utiliser un mail
          personnel (@gmail, laposte, wanadoo ...)
        </Paragraph>
        <Paragraph marginBottom={4}>
          💡{" "}
          <Strong>
            SI vous travaillez dans une collectivité et que vous n&apos;avez pas
            d&apos;adresse de messagerie avec un nom de domaine dédié, la Suite
            territoriale peut répondre à votre besoin. Écrivez-nous sur{" "}
            <Link href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</Link>
          </Strong>
        </Paragraph>
      </Alert>
      {/* <Link
        href="https://proconnect.crisp.help/fr/article/utiliser-proconnect-au-sein-dune-collectivite-ou-dune-mairie-1mobnb6/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Text textDecoration="underline">
          <Strong>
            Qu&apos;est-ce que Proconnect et comment l&apos;utiliser? Consulter
            le tutoriel
          </Strong>
        </Text>
      </Link> */}
    </>
  );
}

export default ProConnect;
