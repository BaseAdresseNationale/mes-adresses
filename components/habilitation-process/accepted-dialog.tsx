import {
  Pane,
  Heading,
  Alert,
  Text,
  Link,
  Strong,
  UnorderedList,
  ListItem,
  UploadIcon,
  UpdatedIcon,
} from "evergreen-ui";

import TextWrapper from "@/components/text-wrapper";
import AuthenticatedUser from "@/components/habilitation-process/authenticated-user";
import { CommuneType } from "@/types/commune";

interface AcceptedDialogProps {
  baseLocaleId: string;
  commune: CommuneType;
  strategy: {
    mandat?: {
      nomNaissance: string;
      nomMarital?: string;
      prenom: string;
      typeMandat:
        | "maire"
        | "maire-delegue"
        | "adjoint-au-maire"
        | "conseiller-municipal"
        | "administrateur";
    };
  };
  isConflicted: boolean;
  flagURL: string | null;
}

function AcceptedDialog({
  baseLocaleId,
  commune,
  strategy,
  isConflicted,
  flagURL,
}: AcceptedDialogProps) {
  const { nomNaissance, nomMarital, prenom } = strategy.mandat || {};

  return (
    <Pane>
      <Pane
        display="flex"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginBottom={16}
      >
        {strategy.mandat ? (
          <AuthenticatedUser
            type="elu"
            flagURL={flagURL}
            title={`${prenom} ${nomMarital || nomNaissance}`}
          />
        ) : (
          <AuthenticatedUser
            type="mairie"
            flagURL={flagURL}
            title={`la mairie de ${commune.nom} (${commune.code})`}
          />
        )}
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
      >
        <Alert
          title="Votre Base Locale a bien été habilitée !"
          intent="success"
          marginBottom={16}
        >
          <Pane display="flex" flexDirection="column">
            <UnorderedList>
              <ListItem>
                Vous pouvez désormais{" "}
                <Strong size={400}>
                  publier et mettre à jour dans la Base Adresse Nationale
                </Strong>{" "}
                les adresses de la commune de{" "}
                <Strong size={400}>{commune.nom}</Strong> via cette{" "}
                <Strong size={400}>Base Adresse Locales</Strong>.
              </ListItem>
            </UnorderedList>
          </Pane>
        </Alert>

        <Pane display="flex" flexDirection="column" marginBottom={16}>
          <Heading is="h3">
            Votre Base Adresse Locale est maintenant prête à être publiée
          </Heading>
          <UnorderedList marginTop={16}>
            <ListItem icon={UploadIcon}>
              Vous pouvez dès maintenant publier vos adresses afin de{" "}
              <Strong>mettre à jour la Base Adresse Nationale</Strong>.
            </ListItem>
            <ListItem icon={UpdatedIcon}>
              Une fois la publication effective,{" "}
              <Strong>
                il vous sera toujours possible de modifier vos adresses
              </Strong>{" "}
              afin de les mettre à jour.
            </ListItem>
          </UnorderedList>
        </Pane>

        {isConflicted && (
          <Alert
            intent="danger"
            title="Cette commune possède déjà une Base Adresse Locale"
            marginTop={16}
          >
            <Text is="div" color="muted" marginTop={4}>
              Une autre Base Adresses Locale est{" "}
              <Strong>déjà synchronisée avec la Base Adresses Nationale</Strong>
              .
            </Text>
            <TextWrapper>
              <Text is="div" color="muted" marginTop={4}>
                En choisissant de publier, cette Base Adresse Locale{" "}
                <Strong>remplacera celle actuellement en place</Strong>.
              </Text>
              <Text is="div" color="muted" marginTop={4}>
                Nous vous recommandons{" "}
                <Strong>
                  d’entrer en contact avec les administrateurs de l’autre Base
                  Adresses Locale
                </Strong>{" "}
                ou notre support:{" "}
                <Link href="mailto:adresse@data.gouv.fr">
                  adresse@data.gouv.fr
                </Link>
              </Text>
            </TextWrapper>
          </Alert>
        )}
      </Pane>
    </Pane>
  );
}

export default AcceptedDialog;
