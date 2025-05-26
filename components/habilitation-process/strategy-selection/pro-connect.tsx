import {
  Pane,
  Heading,
  Strong,
  Text,
  UnorderedList,
  ListItem,
} from "evergreen-ui";
import styles from "./button-pro-connect.module.css";

interface ProConnectProps {
  handleStrategy: () => void;
}

function ProConnect({ handleStrategy }: ProConnectProps) {
  return (
    <>
      <Pane>
        <Heading is="h5" marginBottom={8}>
          M’authentifier comme élu
        </Heading>
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
      <Pane>
        <Heading textAlign="center" color="#225DF5">
          Pourquoi utiliser ProConnect ?
        </Heading>
        <UnorderedList textAlign="left">
          <ListItem>
            Permet de s’authentifier de façon <Strong>simple</Strong> et{" "}
            <Strong>sécurisée</Strong>.
          </ListItem>
          <ListItem>
            Vous serez automatiquement reconnu(e) comme <Strong>élu(e)</Strong>{" "}
            (maire, adjoint(e) ou conseiller(e)) de{" "}
            <Strong>votre commune</Strong>.
          </ListItem>
          <ListItem>
            Vous aurez la possibilité de vous identifier via{" "}
            <Strong>le service de votre choix</Strong> (impots.gouv.fr, ameli.fr
            etc...).
          </ListItem>
        </UnorderedList>
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
