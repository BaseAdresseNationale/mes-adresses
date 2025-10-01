import {
  CaretDownIcon,
  CaretRightIcon,
  Heading,
  Icon,
  Pane,
} from "evergreen-ui";
import { useEffect, useRef, useState } from "react";
import styles from "./accordion-simple.module.css";

interface AccordionCardProps {
  title: string | React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function AccordionSimple({
  title,
  isActive,
  onClick,
  children,
}: AccordionCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 500);
    }
  }, [isActive]);

  return (
    <Pane width="100%">
      <Pane
        margin={16}
        display="flex"
        justifyContent="space-between"
        userSelect="none"
        alignItems="center"
        {...(onClick ? { cursor: "pointer" } : {})}
        onClick={onClick}
      >
        <Heading display="flex" width="100%">
          {title}
        </Heading>
        {onClick && <Icon icon={isVisible ? CaretDownIcon : CaretRightIcon} />}
      </Pane>
      {isVisible && (
        <Pane
          className={isAnimating ? styles.bounceInLeft : styles.bounceOutLeft}
        >
          {children}
        </Pane>
      )}
    </Pane>
  );
}
