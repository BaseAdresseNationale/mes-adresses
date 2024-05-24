import { SignalementDiff } from "@/lib/utils/signalement";
import { Badge, Pane, PlusIcon, MinusIcon, Text } from "evergreen-ui";

interface SignalementParcelleDiffProps {
  parcelles: string[];
  existingParcelles?: string[];
}

export const parcelleDiff = (
  parcelles: string[],
  existingParcelles?: string[]
): { parcelle: string; diff: SignalementDiff }[] => {
  const deletedParcelles = (existingParcelles || [])
    .filter((existingParcelle) => !parcelles.includes(existingParcelle))
    .map((parcelle) => ({
      parcelle,
      diff: SignalementDiff.DELETED,
    }));

  const newOrUnchangedParcelles = parcelles.map((parcelle) =>
    !existingParcelles?.includes(parcelle)
      ? {
          parcelle,
          diff: SignalementDiff.NEW,
        }
      : {
          parcelle,
          diff: SignalementDiff.UNCHANGED,
        }
  );

  return [...deletedParcelles, ...newOrUnchangedParcelles];
};

export function SignalementParcelleDiff({
  parcelles,
  existingParcelles,
}: SignalementParcelleDiffProps) {
  const showDiff = !!existingParcelles;
  const isPlural = showDiff
    ? parcelleDiff(parcelles, existingParcelles).length > 1
    : parcelles.length > 1;

  return parcelles.length > 0 ? (
    <Pane marginTop={10} padding={8} borderRadius={8} className="glass-pane">
      <Text is="div" fontWeight="bold" marginBottom={5}>
        Parcelle{isPlural ? "s" : ""}
      </Text>

      {showDiff ? (
        <Pane display="flex">
          {parcelleDiff(parcelles, existingParcelles).map(
            ({ parcelle, diff }) => (
              <Badge
                key={parcelle}
                marginLeft={4}
                display="flex"
                alignItems="center"
                width="fit-content"
                {...(diff === SignalementDiff.DELETED
                  ? { color: "orange" }
                  : {})}
                {...(diff === SignalementDiff.NEW ? { color: "teal" } : {})}
              >
                {diff === SignalementDiff.DELETED && (
                  <MinusIcon marginRight={4} />
                )}
                {diff === SignalementDiff.NEW && <PlusIcon marginRight={4} />}
                {parcelle}
              </Badge>
            )
          )}
        </Pane>
      ) : (
        parcelles.map((parcelle) => (
          <Badge key={parcelle} marginLeft={4}>
            {parcelle}
          </Badge>
        ))
      )}
    </Pane>
  ) : null;
}
