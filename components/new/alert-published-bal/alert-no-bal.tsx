import { CommuneType } from "@/types/commune";
import { Alert, Paragraph } from "evergreen-ui";

interface AlertNoBALProps {
  commune: CommuneType;
}

function AlertNoBAL({ commune }: AlertNoBALProps) {
  return (
    <Alert
      intent="info"
      title={`La commune ${commune.nom} n'a pas encore de Base Adresse Locale`}
    >
      <Paragraph marginTop={8}>
        Cliquer sur le bouton &quot;Suivant&quot; pour avancer à la prochaine
        étape.
      </Paragraph>
    </Alert>
  );
}

export default AlertNoBAL;
