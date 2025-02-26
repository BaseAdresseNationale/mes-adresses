import ProductTour from "@/components/product-tour";
import { Heading, Pane, Paragraph } from "evergreen-ui";

const steps = [
  {
    target: "body",
    placement: "center",
    content: (
      <Pane>
        <Heading size={800}>
          Bienvenue sur la page de gestion des signalements
        </Heading>
        <Paragraph margin={20}>
          Nous allons vous guider à travers les différentes fonctionnalités de
          cette page
        </Paragraph>
      </Pane>
    ),
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

export default function SignalementPageProductTour() {
  return <ProductTour steps={steps} localStorageKey="signalement" />;
}
