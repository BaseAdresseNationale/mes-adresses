import { Heading, Pane, Text } from "evergreen-ui";
import styles from "./welcome-illustration.module.css";

function WelcomeIllustration() {
  return (
    <div className={styles["welcome-illustration"]}>
      <Pane
        padding={16}
        borderRadius={8}
        background="white"
        border="muted"
        elevation={1}
        position="relative"
        minWidth={360}
      >
        <div className={styles["illustration-wrapper"]}>
          <div />
        </div>

        <Heading is="h1" marginBottom={8}>
          Bienvenue sur mes-adresses!
        </Heading>
        <Text>
          Commencez à gérer vos adresses en créant une Base Adresse Locale
          (BAL).
        </Text>
      </Pane>
    </div>
  );
}

export default WelcomeIllustration;
