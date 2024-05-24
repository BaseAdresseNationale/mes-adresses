import {
  CaretDownIcon,
  CaretRightIcon,
  Heading,
  Icon,
  Pane,
} from "evergreen-ui";
import TextDiff from "./text-diff";
import { SignalementPositionDiff } from "./signalement-position-diff";
import { SignalementParcelleDiff } from "./signalement-parcelle-diff";
import { useRef } from "react";

interface AccordionCardProps {
  title: string;
  backgroundColor?: string;
  isActive?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: React.ReactNode;
}

export function AccordionCard({
  title,
  backgroundColor,
  isActive,
  onMouseEnter,
  onMouseLeave,
  children,
}: AccordionCardProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    onMouseEnter && onMouseEnter();
  };

  const handleMouseLeave = () => {
    onMouseLeave && onMouseLeave();
  };

  return (
    <Pane
      background={backgroundColor || "white"}
      padding={8}
      borderRadius={8}
      marginBottom={8}
      width="100%"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...(isActive ? { elevation: 3 } : {})}
    >
      <Pane
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        userSelect="none"
        {...(onMouseEnter ? { cursor: "pointer" } : {})}
      >
        <Heading is="h3" marginBottom={8}>
          {title}
        </Heading>
        {onMouseEnter && (
          <Icon icon={isActive ? CaretDownIcon : CaretRightIcon} />
        )}
      </Pane>
      <Pane
        overflow="hidden"
        height={
          isActive
            ? contentRef.current?.offsetHeight &&
              contentRef.current?.offsetHeight + 10
            : 0
        }
        transition="height 0.2s ease-in-out"
      >
        <Pane ref={contentRef}>{children}</Pane>
      </Pane>
    </Pane>
  );
}
