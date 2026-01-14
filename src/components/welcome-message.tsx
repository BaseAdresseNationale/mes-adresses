"use client";

import { useState, useEffect, useContext } from "react";
import {
  Pane,
  Dialog,
  Paragraph,
  Heading,
  CrossIcon,
  Icon,
} from "evergreen-ui";

import CommuneFlag from "./commune-flag";
import { CommuneType } from "@/types/commune";
import { AchievementBadge } from "./bal/panel-goal/achievements-badge/achievements-badge";
import MiniCard from "./mini-card";
import LocalStorageContext from "@/contexts/local-storage";

function WelcomeMessage({ commune }: { commune: CommuneType }) {
  const { wasWelcomed, setWasWelcomed } = useContext(LocalStorageContext);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setIsShown(!wasWelcomed);
  }, [wasWelcomed]);

  return (
    <Dialog
      isShown={isShown}
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
      confirmLabel="Commencez l’adressage"
      hasCancel={false}
      onConfirm={() => setWasWelcomed(true)}
      onCloseComplete={() => setWasWelcomed(true)}
    >
      <Pane>
        <Pane marginTop={16} display="flex" flexDirection="row">
          <Pane marginRight={32}>
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title="Publication"
              completed={true}
              width={64}
              height={64}
            />
          </Pane>
          <Pane>
            <Heading>
              Commencez par la <b>publication</b> !
            </Heading>
            <Paragraph marginY={16}>
              La BAL deviendra alors l&apos;unique source officielle des
              adresses de {commune.nom}
            </Paragraph>
          </Pane>
        </Pane>
        <br />
        <Pane display="flex" flexDirection="row">
          <Pane>
            <Heading>Adressez à votre rythme.</Heading>
            <Paragraph marginY={16}>
              Une fois publiées, les adresses sont syncronisées avec la Base
              Adresse Nationale.
              <br />
              Toutes vos modifications remonteront au fil de l&apos;eau.
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
              href="https://adresse.data.gouv.fr/formation-en-ligne"
            />
            <MiniCard
              img="/static/images/video-call.png"
              message="Regardez les tutoriels"
              href="https://tube.numerique.gouv.fr/w/p/cm6YcSnDdztzRjKTH3vNFn?playlistPosition=1"
            />
            <MiniCard
              img="/static/images/manual.png"
              message="Consultez les guides"
              href="https://adresse.data.gouv.fr/documentation-bal"
            />
          </Pane>
        </Pane>
      </Pane>
    </Dialog>
  );
}

export default WelcomeMessage;
