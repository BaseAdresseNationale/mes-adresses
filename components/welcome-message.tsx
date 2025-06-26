import { useState, useEffect, useContext } from "react";
import {
  Pane,
  Dialog,
  Alert,
  Link,
  Paragraph,
  Heading,
  Strong,
  HelpIcon,
} from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";
import LocalStorageContext from "@/contexts/local-storage";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";

function WelcomeMessage() {
  const { token } = useContext(TokenContext);
  const { habilitationIsLoading } = useContext(BalDataContext);
  const { wasWelcomed, setWasWelcomed } = useContext(LocalStorageContext);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setIsShown(!wasWelcomed);
  }, [wasWelcomed]);

  return (
    <Dialog
      isShown={Boolean(isShown && token && !habilitationIsLoading)}
      intent="success"
      title=" Bienvenue sur votre Base Adresse Locale"
      confirmLabel="Commencer l’adressage"
      hasCancel={false}
      onConfirm={() => setWasWelcomed(true)}
      onCloseComplete={() => setWasWelcomed(true)}
    >
      <Paragraph textAlign="center">
        Vous souhaitez <Strong>mettre à jour les adresses</Strong> de votre
        commune ? Vous êtes au <Strong>bon endroit</Strong> ! 🎉
      </Paragraph>

      <VideoContainer link={`${PEERTUBE_LINK}/w/tsqJcL1c7axB9HrMgebyp8`} />

      <Pane marginY={16}>
        <Heading size={400}>Comment cela fonctionne ❓</Heading>
        <Paragraph>
          Gérez directement depuis cette Base Adresse Locale toutes les{" "}
          <Strong>voies</Strong>, <Strong>numéros</Strong> et{" "}
          <Strong>lieux-dits</Strong> de votre commune.
        </Paragraph>
        <Paragraph>
          Lorsque que votre adressage vous convient, il vous suffit de{" "}
          <Strong>publier afin d’alimenter la Base Adresse Nationale</Strong> 🇫🇷
        </Paragraph>
      </Pane>

      <Pane marginY={16}>
        <Heading size={400}>Adressez à votre rythme ⏱</Heading>
        <Paragraph>
          Vous souhaitez <Strong>corriger des erreurs</Strong> mais n’avez pas
          le temps de vérifier l’ensemble des autres adresses ?
        </Paragraph>
        <Paragraph marginY={8}>
          Ce n’est pas un problème,{" "}
          <Strong>publiez tout de même dès que possible</Strong> et vous pourrez
          continuer le reste des modifications <Strong>plus tard</Strong>.
        </Paragraph>
        <Paragraph>
          Une fois votre Base Adresse Locale publiée, les futures modifications
          seront <Strong>enregistrées et transmises automatiquement</Strong> à
          la Base Adresse Nationale. Il est donc inutile de créer une nouvelle
          Base Adresse Locale !
        </Paragraph>
      </Pane>

      <Pane marginY={16}>
        <Heading size={400}>Besoin d’aide ? 📚</Heading>
        <Paragraph>
          Nous mettons à votre disposition{" "}
          <Link href="https://adresse.data.gouv.fr/guides">des guides</Link>{" "}
          afin de vous aider à réaliser votre adressage.
        </Paragraph>
        <Paragraph>
          Si vous rencontrez des difficultés à utiliser cet outils, consultez
          l’aide technique <HelpIcon color="info" size={12} /> en haut à droite
          la fenêtre.
        </Paragraph>
      </Pane>

      <Alert intent="none" title="Vous êtes en charge de plusieurs communes">
        Nous vous recommandons de créer une Base Adresse Locale pour chaque
        commune afin de faciliter leur publication.
      </Alert>
    </Dialog>
  );
}

export default WelcomeMessage;
