import {
  CaretDownIcon,
  CaretRightIcon,
  Heading,
  Icon,
  Pane,
} from "evergreen-ui";
import { useRef, useState } from "react";

interface AccordionCardProps {
  title: string | React.ReactNode;
  backgroundColor?: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  caretPosition?: "center" | "start";
}

export function AccordionCard({
  title,
  backgroundColor,
  isActive,
  onClick,
  children,
  caretPosition = "center",
}: AccordionCardProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);

  return (
    <Pane
      background={backgroundColor || "white"}
      padding={8}
      borderRadius={8}
      marginBottom={8}
      width="100%"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...((children && isActive) || hover ? { elevation: 3 } : {})}
    >
      <Pane
        display="flex"
        justifyContent="space-between"
        alignItems={caretPosition}
        userSelect="none"
        {...(onClick && children ? { cursor: "pointer" } : {})}
      >
        <Heading is="h3" marginY={8} display="flex" width="100%">
          {title}
        </Heading>
        {onClick && children && (
          <Icon
            icon={isActive ? CaretDownIcon : CaretRightIcon}
            paddingTop={caretPosition === "start" ? 16 : 0}
          />
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
