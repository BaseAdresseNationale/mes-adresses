import { useState, useEffect, useContext, useRef } from "react";
import {
  Pane,
  Dialog,
  Link,
  Paragraph,
  Heading,
  defaultTheme,
  CrossIcon,
  Icon,
} from "evergreen-ui";

import CommuneFlag from "./commune-flag";
import { CommuneType } from "@/types/commune";
import { AchievementBadge } from "./bal/panel-goal/achievements-badge/achievements-badge";
import NextImage from "next/image";
import MiniCard from "./mini-card";

function WelcomeMessage({ commune }: { commune: CommuneType }) {
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
        <Pane position="relative" width="100%">
          <Pane display="flex" flexDirection="column" alignItems="center">
            <Heading textAlign="center">
              <CommuneFlag codeCommune={commune.code} />
            </Heading>
            <Heading>
              Bienvenue sur la nouvelle Base Adresse Locale de {commune.nom}
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
      <Pane>
        <Pane marginTop={16} display="flex" flexDirection="row">
          <Pane>
            <Heading>
              Commencez par la <b>publication</b>!
            </Heading>
            <Paragraph marginY={16}>
              La BAL deviendra alors l&apos;unique source officielle des
              adresses de {commune.nom}
            </Paragraph>
          </Pane>
          <Pane marginLeft={32}>
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title="Publication"
              completed={true}
              width={96}
              height={96}
            />
          </Pane>
        </Pane>
        <br />
        <Pane display="flex" flexDirection="row">
          <Pane marginRight={32}>
            <AchievementBadge
              icone="/static/images/achievements/time.png"
              title="Publication"
              completed={true}
              width={96}
              height={96}
            />
          </Pane>
          <Pane>
            <Heading>Adressez à votre rythme.</Heading>
            <Paragraph marginY={16}>
              Une fois publiée, les adresses sont syncronisées avec la base
              nationale.
              <br />
              Toutes vos modifications remonterons au fil de l&apos;eau.
            </Paragraph>
          </Pane>
        </Pane>

        <Pane marginY={16}>
          <Heading marginBottom={16}>Besoin d&apos;aide ?</Heading>
          <Pane
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <MiniCard
              img="/static/images/education.png"
              message="Suivez une formation"
            />
            <MiniCard
              img="/static/images/video-call.png"
              message="Regardez les tutoriels"
            />
            <MiniCard
              img="/static/images/manual.png"
              message="Consulter les guides"
            />
          </Pane>
        </Pane>
      </Pane>
    </Dialog>
  );
}

export default WelcomeMessage;
