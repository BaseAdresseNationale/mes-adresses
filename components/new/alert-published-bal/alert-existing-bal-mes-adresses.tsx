import BALRecoveryContext from "@/contexts/bal-recovery";
import { CommuneType } from "@/types/commune";
import { Alert, Button, Paragraph } from "evergreen-ui";
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
      <Button
        marginTop={8}
        appearance="primary"
        onClick={() => setIsRecoveryDisplayed(true)}
        type="button"
      >
        Récupérer une BAL existante
      </Button>
    </Alert>
  );
}

export default AlertExistingBALMesAdresses;
