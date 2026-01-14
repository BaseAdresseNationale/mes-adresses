import { Alert, Strong, Link, Text, Button, Pane } from "evergreen-ui";

interface PublishBalRejectedStepProps {
  handleClose: () => void;
}

function PublishBalRejectedStep({ handleClose }: PublishBalRejectedStepProps) {
  return (
    <Pane display="flex" flexDirection="column" gap={16}>
      <Alert
        intent="danger"
        title="Votre Base Adresse Locale n'a pas pu être publiée"
        marginTop={16}
        width="100%"
      >
        <Text is="div" color="muted" marginTop={8}>
          Nous vous recommandons{" "}
          <Strong>
            d’entrer en contact avec les administrateurs de l’autre Base
            Adresses Locale
          </Strong>{" "}
          ou notre support:{" "}
          <Link href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</Link>
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

export default PublishBalRejectedStep;
