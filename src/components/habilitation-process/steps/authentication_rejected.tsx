import { Alert, Button, Link, Pane, Text } from "evergreen-ui";
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
        {strategyType === StrategyDTO.type.PROCONNECT && (
          <>
            <br />
            <Text>
              <Link
                href="https://identite.proconnect.gouv.fr/connection-and-account"
                target="_blank"
              >
                Votre compte proconnect
              </Link>{" "}
              est associé à un autre organisme que la collectivité pour laquelle
              vous tentez de publier.
            </Text>
            <br />
            <Text>
              Pour corriger cela, demandez à{" "}
              <Link
                href="https://identite.proconnect.gouv.fr/manage-organizations"
                target="_blank"
              >
                rejoindre l'organisation correspondant à votre mairie
              </Link>{" "}
              en saisissant son SIRET.
            </Text>
            <br />
            <br />
            <Text>
              En cas de souci, contactez-nous à{" "}
              <a href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</a>
            </Text>
          </>
        )}
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
