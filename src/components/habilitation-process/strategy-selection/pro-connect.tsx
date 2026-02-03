import { Pane, Heading, Strong, Text, Link } from "evergreen-ui";
import styles from "./button-pro-connect.module.css";

interface ProConnectProps {
  handleStrategy: () => void;
}

function ProConnect({ handleStrategy }: ProConnectProps) {
  return (
    <>
      <Pane>
        <Heading is="h5" height={60} textAlign="center">
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
      <Link
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
      </Link>
    </>
  );
}

export default ProConnect;
