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
    target: "div[role='tablist'] > a:nth-child(1)",
    content: (
      <Pane>
        <Paragraph>
          Pour les visualiser, rendez-vous sur l&apos;onglet commune et cliquez
          sur <b>Consulter les signalements</b>. Nous vous guiderons ensuite à
          travers les différentes fonctionnalités de cette page.
        </Paragraph>
      </Pane>
    ),
    spotlightPadding: 15,
    callback: () => {
      (
        document.querySelector(
          "div[role='tablist'] > a:nth-child(1)"
        ) as HTMLElement
      ).click();
    },
  },
];

export default function SignalementBalPageProductTour() {
  return <ProductTour steps={steps} localStorageKey="bal-page-signalement" />;
}
