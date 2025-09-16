import { Button, Heading, Pane, Paragraph, Text, Strong } from "evergreen-ui";
import { HabilitationDTO } from "@/lib/openapi-api-bal";
import Confetti from "react-confetti";

interface PublishedBalStepProps {
  habilitation: HabilitationDTO;
  handleClose: () => void;
  dialogWidth: number;
}

function PublishedBalStep({
  habilitation,
  handleClose,
  dialogWidth,
}: PublishedBalStepProps) {
  return (
    <>
      <Confetti
        className="confetti"
        recycle={false}
        numberOfPieces={500}
        tweenDuration={3000}
        width={dialogWidth}
      />
      <Pane display="flex" flexDirection="column" gap={16}>
        <Pane background="white" padding={16} borderRadius={8}>
          <Heading is="h2" textAlign="center">
            Votre Base Adresse Locale a bien été publiée
          </Heading>
        </Pane>

        <Pane background="white" padding={16} borderRadius={8}>
          <Paragraph marginBottom={16}>
            <Heading is="h3">Habilitation</Heading>
            <Text>
              Toutes les modifications remonteront automatiquement dans la Base
              Adresse Nationale
            </Text>
          </Paragraph>
          <Paragraph marginBottom={16}>
            <Heading is="h3">Prochaine objectifs</Heading>
            <Text>
              Pour maintenir la qualité de votre Base Adresse Locale, nous vous
              recommandons de continuer à mettre à jour vos adresses.
            </Text>
            <ul>
              <li>
                <Strong>Cetification des adresses:</Strong> permet de garantir
                la fiabilité des adresses
              </li>
              <li>
                <Strong>Qualité des adresses:</Strong> des améliorations a vos
                adresses vont vous être proposées
              </li>
            </ul>
          </Paragraph>
        </Pane>

        <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
          <Button intent="primary" appearance="primary" onClick={handleClose}>
            Continer l&apos;adressage
          </Button>
        </Pane>
      </Pane>
      <style jsx>{`
        .confetti {
          position: absolute;
        }
      `}</style>
    </>
  );
}

export default PublishedBalStep;
