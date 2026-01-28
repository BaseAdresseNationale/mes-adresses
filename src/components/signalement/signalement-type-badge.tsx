import { Signalement } from "@/lib/openapi-signalement";
import { Badge } from "evergreen-ui";

interface SignalementTypeBadgeProps {
  type: Signalement.type;
}

export const signalementTypeMap = {
  [Signalement.type.LOCATION_TO_CREATE]: {
    label: "Création",
    color: "teal",
    backgroundColor: "#D3F5F7",
    foregroundColor: "#0F5156",
  },
  [Signalement.type.LOCATION_TO_UPDATE]: {
    label: "Modification",
    color: "purple",
    backgroundColor: "#E7E4F9",
    foregroundColor: "#6E62B6",
  },
  [Signalement.type.LOCATION_TO_DELETE]: {
    label: "Suppression",
    color: "orange",
    backgroundColor: "#F8E3DA",
    foregroundColor: "#FFB020",
  },
};

function SignalementTypeBadge({ type }: SignalementTypeBadgeProps) {
  return (
    <Badge
      width="fit-content"
      size="small"
      color={signalementTypeMap[type].color as any}
    >
      {signalementTypeMap[type].label}
    </Badge>
  );
}

export default SignalementTypeBadge;
