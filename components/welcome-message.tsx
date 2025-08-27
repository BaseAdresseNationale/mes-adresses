import { useState, useEffect, useContext, useRef } from "react";
import {
  Pane,
  Dialog,
  Alert,
  Link,
  Paragraph,
  Heading,
  Strong,
  CrossIcon,
  Icon,
} from "evergreen-ui";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";
import Confetti from "react-confetti";
import CommuneFlag from "./commune-flag";
import { CommuneType } from "@/types/commune";

function WelcomeMessage({ commune }: { commune: CommuneType }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { token } = useContext(TokenContext);
  const { habilitationIsLoading } = useContext(BalDataContext);
  // const { wasWelcomed, setWasWelcomed } = useContext(LocalStorageContext);
  // const [isShown, setIsShown] = useState(false);

  const [wasWelcomed, setWasWelcomed] = useState(false);
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    setIsShown(!wasWelcomed);
  }, [wasWelcomed]);

  return (
    <Dialog
      isShown={isShown}
      // isShown={Boolean(isShown && token && !habilitationIsLoading)}
      intent="success"
      header={
        <Pane position="relative">
          <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading textAlign="center" marginBottom={16}>
              <CommuneFlag codeCommune={commune.code} />
            </Heading>
            <Heading>
              Bienvenue sur la nouvelle Base Adresse Locale de {commune.nom} 🎉
            </Heading>
          </Pane>
          <Icon
            icon={CrossIcon}
            cursor="pointer"
            position="absolute"
            right={0}
            top={0}
            onClick={() => setWasWelcomed(true)}
          />
        </Pane>
      }
      confirmLabel="Commencer l’adressage"
      hasCancel={false}
      onConfirm={() => setWasWelcomed(true)}
      onCloseComplete={() => setWasWelcomed(true)}
    >
      <Confetti
        className="confetti"
        recycle={false}
        numberOfPieces={500}
        tweenDuration={3000}
        width={wrapperRef?.current?.offsetWidth + 64}
      />

      <Pane ref={wrapperRef}>
        <Pane marginY={16}>
          <Heading>
            📤 Commencez par la <b>publication</b>!
          </Heading>
          <Paragraph marginY={16}>
            La BAL deviendra alors l&apos;unique source officielle des adresses
            de {commune.nom}
          </Paragraph>
        </Pane>
        <Pane marginY={16}>
          <Heading>⏱ Adressez à votre rythme.</Heading>
          <Paragraph marginY={16}>
            Une fois publiée, les adresses sont syncronisées avec la base
            nationale.
            <br />
            Toutes vos modifications remonterons au fil de l&apos;eau.
          </Paragraph>
        </Pane>
        <Pane marginY={16}>
          <Heading>📚 Besoin d&apos;aide ?</Heading>
          <Paragraph marginY={16}>
            <Link
              href="https://adresse.data.gouv.fr/evenements"
              target="_blank"
            >
              Suivez une formation
            </Link>
            <br />
            <Link
              href="https://tube.numerique.gouv.fr/w/p/cm6YcSnDdztzRjKTH3vNFn?playlistPosition=1"
              target="_blank"
            >
              Regardez les tutoriels
            </Link>
            <br />
            <Link href="https://adresse.data.gouv.fr/guides" target="_blank">
              Consulter les guides
            </Link>
          </Paragraph>
        </Pane>

        {/* <Paragraph textAlign="center">
          Vous souhaitez <Strong>mettre à jour les adresses</Strong> de votre
          commune ? Vous êtes au <Strong>bon endroit</Strong> ! 🎉
        </Paragraph>


        <Pane marginY={16}>
          <Heading size={400}>Comment cela fonctionne ❓</Heading>
          <Paragraph>
            Gérez directement depuis cette Base Adresse Locale toutes les{" "}
            <Strong>voies</Strong>, <Strong>numéros</Strong> et{" "}
            <Strong>lieux-dits</Strong> de votre commune.
          </Paragraph>
          <Paragraph>
            Lorsque que votre adressage vous convient, il vous suffit de{" "}
            <Strong>publier afin d’alimenter la Base Adresse Nationale</Strong>{" "}
            🇫🇷
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
            <Strong>publiez tout de même dès que possible</Strong> et vous
            pourrez continuer le reste des modifications{" "}
            <Strong>plus tard</Strong>.
          </Paragraph>
          <Paragraph>
            Une fois votre Base Adresse Locale publiée, les futures
            modifications seront{" "}
            <Strong>enregistrées et transmises automatiquement</Strong> à la
            Base Adresse Nationale. Il est donc inutile de créer une nouvelle
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
            l’aide technique <HelpIcon color="info" size={12} /> en haut à
            droite la fenêtre.
          </Paragraph>
        </Pane>

        <Alert intent="none" title="Vous êtes en charge de plusieurs communes">
          Nous vous recommandons de créer une Base Adresse Locale pour chaque
          commune afin de faciliter leur publication.
        </Alert> */}
      </Pane>
      <Confetti
        className="confetti"
        recycle={false}
        numberOfPieces={500}
        tweenDuration={3000}
        width={wrapperRef?.current?.offsetWidth + 64}
      />
      <style jsx>{`
        .confetti {
          position: absolute;
        }
      `}</style>
    </Dialog>
  );
}

export default WelcomeMessage;
