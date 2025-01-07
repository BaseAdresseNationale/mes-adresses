import { Heading, Pane } from "evergreen-ui";
import TextDiff from "./text-diff";

interface SignalementVoieDiffCardProps {
  title: string;
  nom: {
    from?: string;
    to: string;
  };
  backgroundColor?: string;
}

export function SignalementVoieDiffCard({
  title,
  nom,
  backgroundColor,
}: SignalementVoieDiffCardProps) {
  return (
    <Pane
      background={backgroundColor || "white"}
      padding={8}
      borderRadius={8}
      marginBottom={8}
      width="100%"
    >
      <Heading is="h3" marginBottom={8}>
        {title}
      </Heading>
      <Pane padding={8} borderRadius={8} className="glass-pane">
        <TextDiff from={nom.from} to={nom.to} />
      </Pane>
    </Pane>
  );
}
