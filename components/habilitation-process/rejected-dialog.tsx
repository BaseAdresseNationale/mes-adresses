import { Alert, Text } from "evergreen-ui";
import { StrategyDTO } from "@/lib/openapi-api-bal";

interface RejectedDialogProps {
  communeName: string;
  strategyType: StrategyDTO.type;
}

function RejectedDialog({ communeName, strategyType }: RejectedDialogProps) {
  return (
    <Alert intent="danger" title="Votre demande d’habilitation a été rejetée">
      <Text>
        {strategyType === StrategyDTO.type.EMAIL &&
          "Vous avez dépassé le nombre maximum de tentatives autorisé."}

        {strategyType === StrategyDTO.type.FRANCECONNECT &&
          `Vous n’avez pas été identifié comme un élu de la commune de ${communeName}.`}
      </Text>
    </Alert>
  );
}

export default RejectedDialog;
