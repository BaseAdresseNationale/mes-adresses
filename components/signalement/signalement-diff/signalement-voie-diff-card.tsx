import { Heading, Pane } from "evergreen-ui";
import TextDiff from "./text-diff";
import { Signalement } from "@/lib/openapi-signalement";
import { signalementTypeMap } from "../signalement-type-badge";

interface SignalementVoieDiffCardProps {
  title: string;
  nom: {
    from?: string;
    to: string;
  };
  signalementType?: Signalement.type;
}

export function SignalementVoieDiffCard({
  title,
  nom,
  signalementType,
}: SignalementVoieDiffCardProps) {
  return (
    <Pane
      background={
        (signalementType &&
          signalementTypeMap[signalementType].backgroundColor) ||
        "white"
      }
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
