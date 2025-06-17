import { Pane, Heading, Strong, Text } from "evergreen-ui";
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
      <Text textDecoration="underline">
        <Strong>
          Aucune donnée personnelle ne nous sera transmise durant ce processus
          d’authentification
        </Strong>
      </Text>
    </>
  );
}

export default ProConnect;
