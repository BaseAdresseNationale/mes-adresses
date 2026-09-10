"use client";

import { useRouter } from "next/navigation";

import {
  Pane,
  Heading,
  Paragraph,
  Text,
  Strong,
  UnorderedList,
  ListItem,
  DeleteIcon,
  Button,
  EnvelopeIcon,
  Link,
} from "evergreen-ui";

export default function Accessibilite() {
  const router = useRouter();

  return (
    <>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="4em"
        marginX="6em"
        marginTop="2em"
        fontSize={14}
      >
        <Pane gap="1em" display="flex" flexDirection="column">
          <Heading is="h2" size={900} color="#2952CC">
            Déclaration d’accessibilité
          </Heading>
          <Pane display="flex" flexDirection="column" justifyContent="center">
            <Pane>
              <Paragraph lineHeight="200%">
                <Strong>ANCT / Incubateur des territoires</Strong> s’engage à
                rendre son service accessible, conformément à l’article 47 de{" "}
                <Strong>la loi n°2005-102 du 11 février 2005</Strong>. À cette
                fin, nous mettons en œuvre la stratégie et les actions suivantes
                :
              </Paragraph>
              <UnorderedList>
                <ListItem>
                  <Link
                    href="https://docs.numerique.gouv.fr/docs/b8f7f83e-56cd-489f-a474-55ec325a2ba6/"
                    textDecoration="underline"
                    color="neutral"
                    target="_blank"
                  >
                    Schéma pluriannuel
                  </Link>
                </ListItem>
              </UnorderedList>
            </Pane>

            <Pane
              width="fit-content"
              padding="1em"
              background="#EBF0FF"
              border="solid 3px #2952CC"
              borderRadius={5}
              marginTop={20}
            >
              <Text fontSize={16}>
                Cette déclaration d’accessibilité a été établie le{" "}
                <Strong>10 septembre 2026</Strong> et s’applique à{" "}
                <Strong>Mes Adresses</Strong> (
                <Link
                  href="https://mes-adresses.data.gouv.fr/"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  https://mes-adresses.data.gouv.fr/
                </Link>
                ).
              </Text>
            </Pane>
          </Pane>
        </Pane>

        <Pane display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            État de conformité
          </Heading>
          <Pane
            padding="2em"
            background="#FDF4F4"
            border="solid 3px #D14343"
            borderRadius={5}
            textAlign="center"
            width="fit-content"
          >
            <Text color="#D14343" fontSize={22} fontWeight={600}>
              <DeleteIcon size={22} marginRight={8} />
              Non-conforme
            </Text>
          </Pane>
          <Paragraph lineHeight="200%">
            <Strong>Mes Adresses</Strong> est non-conforme avec le{" "}
            <Strong>
              référentiel général d’amélioration de l’accessibilité
            </Strong>{" "}
            (RGAA).
          </Paragraph>
        </Pane>

        <Pane display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            Résultats des tests
          </Heading>
          <Paragraph lineHeight="200%">
            L’audit de conformité réalisé par évaluation externe révèle que{" "}
            <Strong>32,76 %</Strong> des critères sont respectés.
          </Paragraph>
        </Pane>

        <Pane display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            Établissement de cette déclaration d’accessibilité
          </Heading>
          <Paragraph lineHeight="200%">
            Cette déclaration a été établie le{" "}
            <Strong>10 septembre 2026</Strong>.
          </Paragraph>
          <Heading is="h4" size={600} color="#2952CC">
            Technologies utilisées
          </Heading>
          <Paragraph lineHeight="200%">
            L’accessibilité de <Strong>Mes Adresses</Strong> s’appuie sur les
            technologies suivantes :
          </Paragraph>
          <UnorderedList>
            <ListItem>HTML</ListItem>
            <ListItem>WAI-ARIA</ListItem>
            <ListItem>CSS</ListItem>
            <ListItem>JavaScript</ListItem>
          </UnorderedList>
        </Pane>

        <Pane width="100%" display="flex" flexDirection="column" gap="1em">
          <Heading is="h3" size={800} color="#2952CC">
            Amélioration et contact
          </Heading>
          <Paragraph width="100%" lineHeight="200%">
            Si vous n’arrivez pas à accéder à un contenu ou à un service, vous
            pouvez contacter le responsable de <Strong>Mes Adresses</Strong>{" "}
            pour être orienté vers une alternative accessible ou obtenir le
            contenu sous une autre forme.
          </Paragraph>
          <Paragraph width="100%" lineHeight="200%">
            Adresse : <Strong>ANCT, Ségur, Paris</Strong>
          </Paragraph>
          <Button
            onClick={async () => {
              await router.push("mailto:adresse@data.gouv.fr");
            }}
            appearance="primary"
            iconBefore={EnvelopeIcon}
            width="fit-content"
          >
            Nous contacter
          </Button>
        </Pane>

        <Pane
          width="100%"
          display="flex"
          flexDirection="column"
          gap="1em"
          marginBottom="2em"
        >
          <Heading is="h3" size={800} color="#2952CC">
            Voie de recours
          </Heading>
          <Pane>
            <Paragraph>
              Si vous constatez un <Strong>défaut d’accessibilité</Strong> vous
              empêchant d’accéder à un contenu ou une fonctionnalité du site,
              que vous nous le signalez et que vous ne parvenez pas à obtenir
              une réponse de notre part, vous êtes en droit de faire parvenir
              vos doléances ou une demande de saisine au{" "}
              <Strong>Défenseur des droits</Strong>.<br />
              Plusieurs moyens sont à votre disposition :
            </Paragraph>
            <UnorderedList>
              <ListItem>
                <Link
                  href="https://formulaire.defenseurdesdroits.fr"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  Écrire un message au <Strong>Défenseur des droits</Strong>.
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  href="https://www.defenseurdesdroits.fr/saisir/delegues"
                  textDecoration="underline"
                  color="neutral"
                  target="_blank"
                >
                  Contacter <Strong>le délégué du Défenseur des droits</Strong>
                </Link>{" "}
                dans votre région.
              </ListItem>
              <ListItem>
                Envoyer un courrier par la poste (gratuit, ne pas mettre de
                timbre).
                <br />
                <Strong>
                  Défenseur des droits
                  <br />
                  Libre réponse 71120
                  <br />
                  75342 Paris CEDEX 07
                </Strong>
              </ListItem>
            </UnorderedList>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
}
