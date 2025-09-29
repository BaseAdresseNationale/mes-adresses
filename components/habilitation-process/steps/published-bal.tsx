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

interface PublishedBalStepProps {
  handleClose: () => void;
  dialogWidth: number;
}

function PublishedBalStep({ handleClose, dialogWidth }: PublishedBalStepProps) {
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
          <Paragraph marginBottom={16}>
            <Text>
              Toutes les modifications remonteront automatiquement dans la Base
              Adresse Nationale
            </Text>
          </Paragraph>
          <Paragraph marginBottom={16}>
            <Heading is="h3">Prochaine objectifs</Heading>
            <Text>
              Pour maintenir la qualité de votre Base Adresse Locale, nous vous
              recommandons de continuer à mettre à jour vos adresses.
            </Text>
          </Paragraph>
          <Paragraph>
            <Text>
              <Strong>Cetification des adresses:</Strong> permet de garantir la
              fiabilité des adresses
            </Text>
          </Paragraph>
        </Pane>

        <Pane display="flex" flexDirection="row" justifyContent="end" gap={16}>
          <Button intent="primary" appearance="primary" onClick={handleClose}>
            Continer l&apos;adressage
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
