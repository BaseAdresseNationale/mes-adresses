import ProductTour from "@/components/product-tour";
import { Heading, Pane, Paragraph } from "evergreen-ui";

const steps = [
  {
    target: "body",
    placement: "center",
    content: (
      <Pane>
        <Heading size={800}>
          Votre Base Adresse Locale a reçu des propositions d&apos;amélioration
        </Heading>
        <Paragraph margin={20} textAlign="justify">
          Des administrés ou des services publics ont proposé des améliorations
          sur les adresses de votre commune via le dispositif de signalement.
        </Paragraph>
      </Pane>
    ),
  },
  {
    target: "div[class^='main-tabs_tabsList'] > a:last-child",
    content: (
      <Pane>
        <Paragraph>
          Pour les visualiser, rendez-vous sur l&apos;onglet signalements.
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 15,
    callback: () => {
      const element = document.querySelector(
        "div[class^='main-tabs_tabsList'] > a:last-child"
      ) as HTMLElement | null;
      if (element) {
        element.click();
      } else {
        console.warn(
          "Element not found: div[class^='main-tabs_tabsList'] > a:last-child"
        );
      }
    },
  },
  {
    target: "div[role='tablist'] > span:nth-child(1)",
    content: (
      <Pane>
        <Paragraph>
          Cet onglet vous permet de consulter les signalements en attente de
          traitement
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
  {
    target: "div[role='tablist'] > span:nth-child(2)",
    content: (
      <Pane>
        <Paragraph>
          Celui-ci vous permet de consulter les signalements déjà traités
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
  {
    target: "input[placeholder='Rechercher un signalement']",
    content: (
      <Pane>
        <Paragraph>
          Vous pouvez filtrer les signalements par nom en tapant dans cette
          barre de recherche...
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 20,
  },
  {
    target: ".filter-button",
    content: (
      <Pane>
        <Paragraph>
          ...ou par type (Création, Modification et Suppression) en cliquant sur
          ce bouton
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
  {
    target: ".main-table-cell",
    content: (
      <Pane>
        <Paragraph>
          Enfin séléctionnez un signalement soit via la liste...
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
  {
    target: ".maplibregl-marker",
    content: (
      <Pane>
        <Paragraph>Soit via la carte</Paragraph>
      </Pane>
    ),
    spotlightPadding: 5,
  },
];

export default function SignalementProductTour() {
  return <ProductTour steps={steps} localStorageKey="signalement" />;
}
