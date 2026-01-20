import { Spinner, Pane, Paragraph } from "evergreen-ui";
import styles from "./overlay.module.css";

interface OverlayProps {
  text?: string;
}

function Overlay({ text }: OverlayProps) {
  return (
    <div>
      <div className={styles.overlay}>
        <Pane
          display="flex"
          flexGrow="1"
          flexFlow="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Spinner size={64} />
          <Paragraph marginTop="default" color="white">
            {text}
          </Paragraph>
        </Pane>
      </div>
    </div>
  );
}

export default Overlay;
