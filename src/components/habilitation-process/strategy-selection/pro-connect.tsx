import { Pane, Strong, Link, Alert, Paragraph } from "evergreen-ui";
import styles from "./button-pro-connect.module.css";
import { useEffect, useState } from "react";
import { ApiAnnuaireService } from "@/lib/api_annuaire";
import {
  PEERTUBE_LINK,
  VideoContainer,
} from "@/components/help/video-container";

interface ProConnectProps {
  codeCommune: string;
  handleStrategy: () => void;
}

function ProConnect({ codeCommune, handleStrategy }: ProConnectProps) {
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    async function loadEmailsMarie() {
      const emailsMarie =
        await ApiAnnuaireService.getEmailsCommune(codeCommune);
      setEmails(emailsMarie);
    }

    loadEmailsMarie();
  }, [codeCommune]);

  return (
    <>
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
      <Alert intent="info" marginBottom={16}>
        <Paragraph marginBottom={16}>
          <Strong>
            ProConnect, équivalent de FranceConnect pour les professionnels
          </Strong>
        </Paragraph>
        <Paragraph>
          <Strong>Connectez-vous avec</Strong> l’adresse électronique{" "}
          {emails.length > 0 && <Strong>{emails.join(", ")} </Strong>}
          indiquée par votre mairie dans{" "}
          <Link href="https://service-public.gouv.fr" target="_blank">
            l’annuaire du service public
          </Link>{" "}
        </Paragraph>
        <Paragraph>
          Ou une adresse avec le même nom de domaine (exemple :
          p.nom@commune.fr).
        </Paragraph>
        <Paragraph marginTop={16}>
          Pour toute question, <Strong>contactez notre équipe :</Strong>{" "}
          <Link href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</Link>
        </Paragraph>
      </Alert>
      <iframe
        title="Tuto connection ProConnect"
        src={`${PEERTUBE_LINK}/videos/embed/iojCiUnSuc29dq5a1bUPVy`}
        // https://tube.numerique.gouv.fr/videos/embed/iojCiUnSuc29dq5a1bUPVy
        height="315px"
        width="100%"
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts allow-popups"
        allowFullScreen
        style={{ borderRadius: "8px" }}
      />
    </>
  );
}

export default ProConnect;
