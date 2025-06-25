import { Pane, Heading, Paragraph, VideoIcon } from "evergreen-ui";
import Link from "next/link";

const PEERTUBE_LINK =
  process.env.NEXT_PUBLIC_PEERTUBE || "https://tube.numerique.gouv.fr";

interface VideoContainerProps {
  title?: string;
  link: string;
}

function VideoContainer({ title, link }: VideoContainerProps) {
  // Extract code to use embed video
  const embedCode = link.replace(`${PEERTUBE_LINK}/w/`, "");

  return (
    <Pane
      backgroundColor="white"
      elevation={1}
      display="flex"
      flexDirection="column"
      marginTop={8}
      marginBottom={16}
      padding={16}
    >
      {title && (
        <Heading size={600} marginY={16}>
          {title}
        </Heading>
      )}
      <iframe
        title="Création d’une Base Adresse Locale"
        src={`${PEERTUBE_LINK}/videos/embed/${embedCode}?p2p=0`}
        height="315px"
        width="100%"
        frameBorder="0"
        sandbox="allow-same-origin allow-scripts allow-popups"
        allowFullScreen
      />
      <Paragraph paddingTop={10}>
        <VideoIcon paddingRight={5} verticalAlign="middle" size={25} />
        <Link href={PEERTUBE_LINK}>Retouvez tous les tutoriels vidéos</Link>
      </Paragraph>
    </Pane>
  );
}

export { VideoContainer, PEERTUBE_LINK };
