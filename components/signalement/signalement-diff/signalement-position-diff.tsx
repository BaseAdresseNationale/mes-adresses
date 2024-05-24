import { Position } from "@/lib/openapi-api-bal";
import { PositionDTO } from "@/lib/openapi-signalement";
import { getPositionName } from "@/lib/positions-types-list";
import { SignalementDiff } from "@/lib/utils/signalement";
import {
  Heading,
  MinusIcon,
  PlusIcon,
  Pane,
  Small,
  Strong,
  Text,
  Badge,
  ArrowRightIcon,
} from "evergreen-ui";
import React from "react";

interface SignalementPositionDiffProps {
  positions: PositionDTO[] | Position[];
  existingPositions?: Position[];
}

type PositionDiff = PositionDTO & {
  diff: SignalementDiff | [PositionDTO.type, Position.type];
};

export const positionDiff = (
  positions: PositionDTO[],
  existingPositions?: Position[]
): PositionDiff[] => {
  const deletedPositions = (existingPositions || [])
    .filter(
      (existingPosition) =>
        !positions.find(
          (position) =>
            position.point.coordinates.join("-") ===
            existingPosition.point.coordinates.join("-")
        )
    )
    .map((position) => ({ ...position, diff: SignalementDiff.DELETED }));

  const newOrModifiedPositions = positions.map((position) => {
    const latLong = position.point.coordinates.join("-");

    const existingPosition = existingPositions?.find(
      (p) => p.point.coordinates.join("-") === latLong
    );

    return {
      ...position,
      diff: existingPosition
        ? [existingPosition.type, position.type]
        : SignalementDiff.NEW,
    };
  });

  return [...deletedPositions, ...newOrModifiedPositions] as PositionDiff[];
};

export function SignalementPositionDiff({
  positions,
  existingPositions,
}: SignalementPositionDiffProps) {
  const showDiff = !!existingPositions;
  const isPlural = showDiff
    ? positionDiff(positions as PositionDTO[], existingPositions).length > 1
    : positions.length > 1;

  return (
    <Pane marginTop={10} padding={8} borderRadius={8} className="glass-pane">
      <Text fontWeight="bold">Position{isPlural ? "s" : ""}</Text>
      <Pane display="grid" gridTemplateColumns="3fr 1fr 1fr">
        <Pane />
        <Strong fontWeight={200} fontSize="small">
          Lat
        </Strong>
        <Strong fontWeight={200} fontSize="small">
          Long
        </Strong>

        {showDiff
          ? positionDiff(positions as PositionDTO[], existingPositions).map(
              ({ type, diff, point }, index) => (
                <React.Fragment key={index}>
                  {Array.isArray(diff) && diff[0] !== diff[1] ? (
                    <Badge
                      display="flex"
                      alignItems="center"
                      width="fit-content"
                      size="small"
                      color="purple"
                      marginY={2}
                    >
                      {getPositionName(diff[0])}
                      <ArrowRightIcon marginX={4} />
                      {getPositionName(diff[1])}
                    </Badge>
                  ) : (
                    <Badge
                      display="flex"
                      alignItems="center"
                      width="fit-content"
                      size="small"
                      marginY={2}
                      {...(diff === SignalementDiff.DELETED
                        ? { color: "orange" }
                        : diff === SignalementDiff.NEW
                          ? { color: "teal" }
                          : {})}
                    >
                      {diff === SignalementDiff.DELETED && (
                        <MinusIcon marginRight={4} />
                      )}
                      {diff === SignalementDiff.NEW && (
                        <PlusIcon marginRight={4} />
                      )}
                      {getPositionName(type)}
                    </Badge>
                  )}
                  <Heading
                    size={100}
                    marginY="auto"
                    {...(diff === SignalementDiff.DELETED
                      ? { color: "orange" }
                      : diff === SignalementDiff.NEW
                        ? { color: "teal" }
                        : {})}
                  >
                    <Small>{point.coordinates[1].toFixed(6)}</Small>
                  </Heading>
                  <Heading
                    size={100}
                    marginY="auto"
                    {...(diff === SignalementDiff.DELETED
                      ? { color: "orange" }
                      : diff === SignalementDiff.NEW
                        ? { color: "teal" }
                        : {})}
                  >
                    <Small>{point.coordinates[0].toFixed(6)}</Small>
                  </Heading>
                </React.Fragment>
              )
            )
          : positions.map(({ type, point }, index) => (
              <React.Fragment key={index}>
                <Badge width="fit-content" marginY={2}>
                  {getPositionName(type)}
                </Badge>
                <Heading size={100} marginY="auto">
                  <Small>{point.coordinates[1].toFixed(6)}</Small>
                </Heading>
                <Heading size={100} marginY="auto">
                  <Small>{point.coordinates[0].toFixed(6)}</Small>
                </Heading>
              </React.Fragment>
            ))}
      </Pane>
    </Pane>
  );
}
