import {
  CaretDownIcon,
  CaretRightIcon,
  Heading,
  Icon,
  Pane,
} from "evergreen-ui";
import { useRef, useState } from "react";

interface AccordionCardProps {
  title: string;
  backgroundColor?: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function AccordionCard({
  title,
  backgroundColor,
  isActive,
  onClick,
  children,
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
      {...(isActive || hover ? { elevation: 3 } : {})}
    >
      <Pane
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        userSelect="none"
        {...(onClick ? { cursor: "pointer" } : {})}
      >
        <Heading is="h3" marginBottom={8}>
          {title}
        </Heading>
        {onClick && <Icon icon={isActive ? CaretDownIcon : CaretRightIcon} />}
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
