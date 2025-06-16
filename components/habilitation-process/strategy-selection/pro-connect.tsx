import {
  Pane,
  Heading,
  Strong,
  Text,
} from "evergreen-ui";
import styles from "./button-pro-connect.module.css";

interface ProConnectProps {
  handleStrategy: () => void;
}

function ProConnect({ handleStrategy }: ProConnectProps) {
  return (
    <>
      <Pane>
        <Heading is="h5" marginBottom={36}>
          Via votre compte ProConnect
        </Heading>
      </Pane>
      <Pane display="flex" flexDirection="column" alignItems="center" marginBottom={16}>
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
