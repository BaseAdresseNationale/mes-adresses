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
  existingPositions: Position[];
}

type PositionDiff = PositionDTO & {
  diff: SignalementDiff | [PositionDTO.type, Position.type];
};

export const positionDiff = (
  positions: PositionDTO[],
  existingPositions: Position[]
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
  const positionsDiff = positionDiff(
    positions as PositionDTO[],
    existingPositions
  );

  return (
    <Pane marginTop={10} padding={8} borderRadius={8} className="glass-pane">
      <Text fontWeight="bold">
        Position{positionsDiff.length > 1 ? "s" : ""}
      </Text>
      <Pane display="grid" gridTemplateColumns="2fr 2fr" rowGap={6}>
        <Pane />
        <Strong fontWeight={200} fontSize="small">
          Modification proposée
        </Strong>

        {positionsDiff.map(({ type, diff }, index) => {
          const positionTypeChanged =
            Array.isArray(diff) && diff[0] !== diff[1];

          if (positionTypeChanged) {
            return (
              <React.Fragment key={index}>
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
                <Heading size={100} marginY="auto">
                  <Small>Modification de type</Small>
                </Heading>
              </React.Fragment>
            );
          } else if (diff === SignalementDiff.DELETED) {
            return (
              <React.Fragment key={index}>
                <Badge
                  display="flex"
                  alignItems="center"
                  width="fit-content"
                  size="small"
                  marginY={2}
                  color="orange"
                >
                  <MinusIcon marginRight={4} />
                  {getPositionName(type)}
                </Badge>
                <Heading size={100} marginY="auto">
                  <Small>Suppression de position</Small>
                </Heading>
              </React.Fragment>
            );
          } else if (diff === SignalementDiff.NEW) {
            return (
              <React.Fragment key={index}>
                <Badge
                  display="flex"
                  alignItems="center"
                  width="fit-content"
                  size="small"
                  marginY={2}
                  color="teal"
                >
                  <PlusIcon marginRight={4} />
                  {getPositionName(type)}
                </Badge>
                <Heading size={100} marginY="auto">
                  <Small>Ajout de position</Small>
                </Heading>
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={index}>
                <Badge
                  display="flex"
                  alignItems="center"
                  width="fit-content"
                  size="small"
                  marginY={2}
                  color="blue"
                >
                  {getPositionName(type)}
                </Badge>
                <Heading size={100} marginY="auto">
                  <Small>Pas de modification</Small>
                </Heading>
              </React.Fragment>
            );
          }
        })}
      </Pane>
    </Pane>
  );
}
