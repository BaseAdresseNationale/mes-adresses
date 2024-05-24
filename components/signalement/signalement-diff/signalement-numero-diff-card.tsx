import { Pane, Text } from "evergreen-ui";
import TextDiff from "./text-diff";
import { SignalementPositionDiff } from "./signalement-position-diff";
import { SignalementParcelleDiff } from "./signalement-parcelle-diff";
import { AccordionCard } from "./accordion-card";

interface SignalementNumeroDiffCardProps {
  title: string;
  numero: {
    from?: string;
    to: string;
  };
  voie: {
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
  complement: {
    from?: string;
    to: string;
  };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  backgroundColor?: string;
  isActive?: boolean;
}

export function SignalementNumeroDiffCard({
  title,
  numero,
  voie,
  positions,
  parcelles,
  complement,
  onMouseEnter,
  onMouseLeave,
  backgroundColor,
  isActive,
}: SignalementNumeroDiffCardProps) {
  return (
    <AccordionCard
      title={title}
      backgroundColor={backgroundColor}
      isActive={isActive}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Pane
        marginTop={8}
        display="grid"
        gridTemplateRows="1fr"
        gridTemplateColumns="0.5fr 1.5fr"
        gridColumnGap={8}
      >
        <Pane padding={8} borderRadius={8} className="glass-pane">
          <Text is="div" fontWeight="bold" marginBottom={5}>
            Numéro
          </Text>
          <TextDiff from={numero.from} to={numero.to} />
        </Pane>
        <Pane padding={8} borderRadius={8} className="glass-pane">
          <Text is="div" fontWeight="bold" marginBottom={5}>
            Voie
          </Text>
          <TextDiff from={voie.from} to={voie.to} />
        </Pane>
      </Pane>
      {complement.to && (
        <Pane marginTop={8} padding={8} borderRadius={8} className="glass-pane">
          <Text is="div" fontWeight="bold" marginBottom={5}>
            Complément
          </Text>
          <TextDiff from={complement.from} to={complement.to} />
        </Pane>
      )}
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
