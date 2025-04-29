import BALRecoveryContext from "@/contexts/bal-recovery";
import BALWidgetContext from "@/contexts/bal-widget";
import { CommuneType } from "@/types/commune";
import { Alert, Button, Pane, Paragraph } from "evergreen-ui";
import { useContext } from "react";

interface AlertExistingBALMesAdressesProps {
  existingBALCount: number;
  commune: CommuneType;
}

function AlertExistingBALMesAdresses({
  existingBALCount,
  commune,
}: AlertExistingBALMesAdressesProps) {
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);
  const { open, navigate } = useContext(BALWidgetContext);

  const openBALWidget = () => {
    navigate(`/commune/bal-status?code=${commune.code}&nom=${commune.nom}`);
    open();
  };

  return (
    <Alert
      title={`Des Bases Adresses Locales non-publiées existent déjà pour ${commune.nom}`}
      intent="info"
      marginTop={16}
    >
      <Paragraph marginTop={8}>
        Il y a déjà <b>{existingBALCount} BAL(s) existante(s)</b> pour{" "}
        {commune.nom}. Peut-être cherchez-vous à récupérer l&apos;une
        d&apos;entre elles?
      </Paragraph>
      <Pane marginTop={8} display="flex" gap={8}>
        <Button
          appearance="primary"
          onClick={() => setIsRecoveryDisplayed(true)}
          type="button"
        >
          Récupérer une BAL avec un email
        </Button>
        <Button onClick={openBALWidget} type="button">
          Voir les BAL existantes
        </Button>
      </Pane>
    </Alert>
  );
}

export default AlertExistingBALMesAdresses;
