import { Alert, Text } from "evergreen-ui";
import { Strategy } from "@/lib/openapi";

interface RejectedDialogProps {
  communeName: string;
  strategyType: Strategy.type;
}

function RejectedDialog({ communeName, strategyType }: RejectedDialogProps) {
  return (
    <Alert intent="danger" title="Votre demande d’habilitation a été rejetée">
      <Text>
        {strategyType === "email" &&
          "Vous avez dépassé le nombre maximum de tentatives autorisé."}

        {strategyType === "franceconnect" &&
          `Vous n’avez pas été identifié comme un élu de la commune de ${communeName}.`}
      </Text>
    </Alert>
  );
}

export default RejectedDialog;
