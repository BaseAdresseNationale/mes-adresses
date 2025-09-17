import { Alert, Button, Pane, Text } from "evergreen-ui";
import { StrategyDTO } from "@/lib/openapi-api-bal";

interface AuthenticationRejectedStepProps {
  communeName: string;
  strategyType: StrategyDTO.type;
  handleClose: () => void;
}

function AuthenticationRejectedStep({
  communeName,
  strategyType,
  handleClose,
}: AuthenticationRejectedStepProps) {
  return (
    <Pane display="flex" flexDirection="column" gap={16}>
      <Alert intent="danger" title="Votre demande d’habilitation a été rejetée">
        <Text>
          {strategyType === StrategyDTO.type.EMAIL &&
            "Vous avez dépassé le nombre maximum de tentatives autorisé."}

          {strategyType === StrategyDTO.type.FRANCECONNECT &&
            `Vous n’avez pas été identifié comme un élu de la commune de ${communeName}.`}
        </Text>
      </Alert>

      <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
        <Button intent="primary" onClick={handleClose}>
          Fermer
        </Button>
      </Pane>
    </Pane>
  );
}

export default AuthenticationRejectedStep;
