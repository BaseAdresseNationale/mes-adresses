import { Pane } from "evergreen-ui";
import TextDiff from "./text-diff";
import { SignalementPositionDiff } from "./signalement-position-diff";
import { SignalementParcelleDiff } from "./signalement-parcelle-diff";
import { AccordionCard } from "./accordion-card";
import { SignalementPosition } from "./signalement-position";
import { SignalementParcelle } from "./signalement-parcelle";
import { signalementTypeMap } from "../signalement-type-badge";
import { Signalement } from "@/lib/openapi-signalement";

interface SignalementToponymeDiffCardProps {
  title: string;
  nom: {
    from?: string;
    to: string;
  };
  positions: {
    from?: any[];
    to: any[];
  };
  parcelles: {
    from?: string[];
    to: string[];
  };
  signalementType?: Signalement.type;
  backgroundColor?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SignalementToponymeDiffCard({
  title,
  nom,
  signalementType,
  backgroundColor,
  positions,
  parcelles,
  isActive,
  onClick,
}: SignalementToponymeDiffCardProps) {
  return (
    <AccordionCard
      title={title}
      backgroundColor={
        backgroundColor ||
        (signalementType && signalementTypeMap[signalementType].backgroundColor)
      }
      isActive={isActive}
      onClick={onClick}
    >
      <Pane padding={8} borderRadius={8} className="glass-pane">
        <TextDiff from={nom.from} to={nom.to} />
      </Pane>
      {positions.from ? (
        <SignalementPositionDiff
          existingPositions={positions.from}
          positions={positions.to}
        />
      ) : (
        <SignalementPosition positions={positions.to} />
      )}
      {parcelles.from ? (
        <SignalementParcelleDiff
          parcelles={parcelles.to}
          existingParcelles={parcelles.from}
        />
      ) : (
        <SignalementParcelle
          parcelles={parcelles.to}
          signalementType={signalementType}
        />
      )}
    </AccordionCard>
  );
}
