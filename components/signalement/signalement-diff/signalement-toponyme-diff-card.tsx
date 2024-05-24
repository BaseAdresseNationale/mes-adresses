import { Pane } from "evergreen-ui";
import TextDiff from "./text-diff";
import { SignalementPositionDiff } from "./signalement-position-diff";
import { SignalementParcelleDiff } from "./signalement-parcelle-diff";
import { AccordionCard } from "./accordion-card";

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
  backgroundColor?: string;
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function SignalementToponymeDiffCard({
  title,
  nom,
  backgroundColor,
  positions,
  parcelles,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: SignalementToponymeDiffCardProps) {
  return (
    <AccordionCard
      title={title}
      backgroundColor={backgroundColor}
      isActive={isActive}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Pane padding={8} borderRadius={8} className="glass-pane">
        <TextDiff from={nom.from} to={nom.to} />
      </Pane>
      <SignalementPositionDiff
        existingPositions={positions.from}
        positions={positions.to}
      />
      <SignalementParcelleDiff
        parcelles={parcelles.to}
        existingParcelles={parcelles.from}
      />
    </AccordionCard>
  );
}
