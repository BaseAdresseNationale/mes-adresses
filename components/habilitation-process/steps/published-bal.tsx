import {
  Button,
  Heading,
  Pane,
  Paragraph,
  Text,
  Strong,
  defaultTheme,
} from "evergreen-ui";
import Confetti from "react-confetti";
import style from "./animation-achievement.module.css";
import AchievementBadge from "@/components/bal/panel-goal/achievements-badge/achievements-badge";
import { useEffect, useState } from "react";
import { CommuneType } from "@/types/commune";

interface PublishedBalStepProps {
  commune: CommuneType;
  handleClose: () => void;
  dialogWidth: number;
}

function PublishedBalStep({
  commune,
  handleClose,
  dialogWidth,
}: PublishedBalStepProps) {
  const [displayTitle, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(true);
    }, 1000);
  }, []);

  return (
    <>
      <Confetti
        className="confetti"
        recycle={false}
        numberOfPieces={500}
        tweenDuration={1}
        width={dialogWidth}
      />
      <Pane display="flex" flexDirection="column" gap={16}>
        <Pane
          background="white"
          paddingY={32}
          paddingX={16}
          borderRadius={8}
          height={128}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={32}
        >
          {displayTitle && (
            <AchievementBadge
              icone="/static/images/achievements/published-bal.svg"
              title="Publication"
              completed={true}
              width={64}
              height={64}
              className={style.tada}
            />
          )}
          {displayTitle && (
            <Heading
              is="h2"
              textAlign="center"
              size={600}
              className={style.slideInRight}
              color={defaultTheme.colors.green700}
            >
              Votre Base Adresse Locale a bien été publiée
            </Heading>
          )}
        </Pane>

        <Pane background="white" padding={16} borderRadius={8}>
          <Heading is="h3" marginBottom={8}>
            Grâce à la publication
          </Heading>
          <Paragraph is="li" marginBottom={8}>
            Toutes les{" "}
            <Strong>modifications remonteront automatiquement</Strong> dans la{" "}
            <a
              href={`https://adresse.data.gouv.fr/commune/${commune.code}`}
              target="_blank"
              rel="noreferrer"
            >
              Base Adresse Nationale.
            </a>
          </Paragraph>
          <Paragraph is="li" marginBottom={8}>
            Votre commune s&apos;est mise en conformité avec la{" "}
            <a
              href="https://guide-bonnes-pratiques.adresse.data.gouv.fr/transmettre-les-informations-a-la-base-adresse-nationale/le-coeur-de-linformation-legale"
              target="_blank"
              rel="noreferrer"
            >
              Loi 3DS
            </a>
            .
          </Paragraph>
          <Paragraph is="li" marginBottom={16}>
            Les services de secours, administrations et particuliers peuvent
            désormais <Strong>déposer des signalements</Strong> pour vous aider
            à fiabiliser vos adresses.
          </Paragraph>
          <Heading is="h3" marginBottom={8}>
            Prochain objectif
          </Heading>
          <Paragraph>
            Fiabiliser vos adresses grâce à la{" "}
            <a
              href="https://guide.mes-adresses.data.gouv.fr/publier-une-base-adresse-locale-1/certifier-ses-adresses"
              target="_blank"
              rel="noreferrer"
            >
              certification
            </a>
            . Celle-ci permet de mettre en valeur votre travail et de{" "}
            <Strong>faciliter la réutilisation de la donnée</Strong>.
          </Paragraph>
        </Pane>

        <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
          <Button intent="primary" appearance="primary" onClick={handleClose}>
            Continuer l&apos;adressage
          </Button>
        </Pane>
      </Pane>
      <style jsx>{`
        .confetti {
          position: absolute;
        }
      `}</style>
    </>
  );
}

export default PublishedBalStep;
