import React from "react";
import { Pane, Heading, Paragraph } from "evergreen-ui";
import Main from "@/layouts/main";
import useWindowSize from "@/hooks/useWindowSize";

function MentionsLegales() {
  const { isMobile } = useWindowSize();
  return (
    <Main>
      <Pane
        padding={20}
        fontSize={18}
        {...(isMobile
          ? { padding: 20 }
          : {
              marginX: "6em",
              marginY: "2em",
            })}
      >
        <Heading is="h1" fontSize={24} marginBottom={30}>
          Bases Adresses Locales – Mentions légales
        </Heading>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Éditeur de la plateforme
          </Heading>

          <Paragraph>
            Bases Adresses Locales est édité au sein de l’Incubateur des
            Territoires de l’Agence nationale de la cohésion des territoires
            (ANCT) située :
          </Paragraph>
          <Pane marginTop="15px">
            <Paragraph>20 avenue de Ségur</Paragraph>
            <Paragraph>75007 Paris</Paragraph>
            <Paragraph>France</Paragraph>

            <Paragraph marginTop="15px">Téléphone : 01 85 58 60 00</Paragraph>
          </Pane>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Directeur de la publication
          </Heading>

          <Paragraph>
            Le directeur de publication est Monsieur Stanislas BOURRON,
            Directeur général de l’ANCT.
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Hébergement de la plateforme
          </Heading>

          <Paragraph>La plateforme est hébergée par :</Paragraph>

          <Pane marginTop="15px">
            <Paragraph>OVH</Paragraph>
            <Paragraph>2 rue Kellermann</Paragraph>
            <Paragraph>59100 Roubaix</Paragraph>
            <Paragraph>France</Paragraph>

            <Paragraph marginTop="15px">Téléphone : 01 85 58 60 00</Paragraph>
          </Pane>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Accessibilité
          </Heading>

          <Paragraph>
            La conformité aux normes d’accessibilité numérique est un objectif
            ultérieur mais nous tâchons de rendre cette plateforme accessible à
            toutes et à tous.
          </Paragraph>

          <Heading is="h3" fontSize={18} marginBottom={10} marginTop={10}>
            En savoir plus
          </Heading>

          <Paragraph>
            Pour en savoir plus sur la politique d’accessibilité numérique de
            l’État :{" "}
            <a target="_blank" href="https://accessibilite.numerique.gouv.fr/">
              https://accessibilite.numerique.gouv.fr/
            </a>
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Signaler un dysfonctionnement
          </Heading>

          <Paragraph>
            Si vous rencontrez un défaut d’accessibilité vous empêchant
            d’accéder à un contenu ou une fonctionnalité de la plateforme, merci
            de nous en faire part :{" "}
            <a href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</a>
          </Paragraph>

          <Paragraph>
            Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en
            droit de faire parvenir vos doléances ou une demande de saisine au
            Défenseur des Droits.
          </Paragraph>
        </Pane>

        <Pane marginTop="20px" marginBottom="20px" is="section">
          <Heading is="h2" fontSize={20} marginBottom={10}>
            Sécurité
          </Heading>

          <Paragraph>
            La plateforme est protégée par un certificat électronique,
            matérialisé pour la grande majorité des navigateurs par un cadenas.
            Cette protection participe à la confidentialité des échanges.
          </Paragraph>

          <Paragraph>
            En aucun cas, les services associés à la plateforme ne seront à
            l’origine d’envoi d’e-mails pour vous demander la saisie
            d’informations personnelles.
          </Paragraph>
        </Pane>
      </Pane>
    </Main>
  );
}

export default MentionsLegales;
