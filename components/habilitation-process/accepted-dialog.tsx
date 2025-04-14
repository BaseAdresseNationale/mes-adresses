import { useState, useEffect } from "react";
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
import { CommuneDTO } from "@/lib/openapi-api-bal";
import { BasesLocalesService } from "@/lib/openapi-api-bal";

interface AcceptedDialogProps {
  baseLocaleId: string;
  commune: CommuneDTO;
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
  expiresAt: string;
  isConflicted: boolean;
}

function AcceptedDialog({
  baseLocaleId,
  commune,
  strategy,
  expiresAt,
  isConflicted,
}: AcceptedDialogProps) {
  const [isBALCertified, setIsBALCertified] = useState(false);

  const { nomNaissance, nomMarital, prenom, typeMandat } =
    strategy.mandat || {};

  useEffect(() => {
    async function fetchBALStats() {
      const { nbNumeros, nbNumerosCertifies } =
        await BasesLocalesService.findBaseLocale(baseLocaleId);

      setIsBALCertified(nbNumeros === nbNumerosCertifies);
    }

    fetchBALStats();
  }, [baseLocaleId, setIsBALCertified]);

  return (
    <Pane>
      <Pane display="flex" flexDirection="column" marginTop={0} gap={24}>
        <Pane
          display="flex"
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
        >
          {strategy.mandat ? (
            <AuthenticatedUser
              type="elu"
              title={`${prenom} ${nomMarital || nomNaissance}`}
            />
          ) : (
            <AuthenticatedUser
              type="mairie"
              title={`la mairie de ${commune.nom} (${commune.code})`}
            />
          )}
        </Pane>

        <Alert
          title="Votre Base Locale a bien été habilitée !"
          intent="success"
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
              <ListItem>
                Cette habilitation, expirera le{" "}
                <Strong size={400}>
                  {new Date(expiresAt).toLocaleDateString()}
                </Strong>
                . Après cette date, vous serez invité à demander une nouvelle
                habilitation.
              </ListItem>
            </UnorderedList>
          </Pane>
        </Alert>
      </Pane>

      <Pane marginTop={16} paddingTop={16} borderTop="2px solid #EFEFEF">
        <Pane
          display="flex"
          flexDirection="column"
          marginBottom={16}
          alignItems="center"
        >
          <Heading is="h3" marginBottom={4} textAlign="center">
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

        {!isBALCertified && (
          <Alert
            intent="warning"
            title="Toutes vos adresses ne sont pas certifiées"
            marginY={16}
          >
            <Text is="div" color="muted" marginTop={4}>
              Nous vous recommandons de certifier la{" "}
              <Strong>totalité de vos adresses</Strong>.
            </Text>

            <TextWrapper>
              <Pane>
                <Text is="div" color="muted" marginTop={4}>
                  Une adresse certifiée est déclarée{" "}
                  <Strong>authentique par la mairie</Strong>, ce qui{" "}
                  <Strong>
                    renforce la qualité de la Base Adresse Locale et facilite sa
                    réutilisation
                  </Strong>
                  .
                </Text>
                <Text is="div" color="muted" marginTop={4}>
                  Vous êtes cependant libre de{" "}
                  <Strong>
                    publier maintenant et certifier vos adresses plus tard
                  </Strong>
                  .
                </Text>
                <Text is="div" color="muted" marginTop={4}>
                  Notez qu’il est possible de certifier la totalité de vos
                  adresses depuis l&apos;onglet « Commune ».
                </Text>
              </Pane>
            </TextWrapper>
          </Alert>
        )}
      </Pane>

      {isConflicted && (
        <Alert
          intent="danger"
          title="Cette commune possède déjà une Base Adresse Locale"
          marginTop={16}
        >
          <Text is="div" color="muted" marginTop={4}>
            Une autre Base Adresses Locale est{" "}
            <Strong>déjà synchronisée avec la Base Adresses Nationale</Strong>.
          </Text>
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
            <Link href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</Link>
          </Text>
        </Alert>
      )}
    </Pane>
  );
}

export default AcceptedDialog;
