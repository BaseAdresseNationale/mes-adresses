"use client";

import { useEffect, useRef } from "react";
import { Pane, Text, WarningSignIcon } from "evergreen-ui";

const ALERT_MESSAGE = process.env.NEXT_PUBLIC_ALERT_MESSAGE?.trim();

interface AlertBannerProps {
  onHeightChange: (height: number) => void;
}

function AlertBanner({ onHeightChange }: AlertBannerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() => {
      onHeightChange(element.offsetHeight);
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      onHeightChange(0);
    };
  }, [onHeightChange]);

  if (!ALERT_MESSAGE) {
    return null;
  }

  return (
    <Pane
      ref={ref}
      role="alert"
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      paddingX={16}
      paddingY={8}
      backgroundColor="#FFEFD2"
      borderBottom="1px solid #FFB020"
    >
      <WarningSignIcon
        size={16}
        color="#996A13"
        marginRight={8}
        flexShrink={0}
      />
      <Text color="#66460D" textAlign="center">
        {ALERT_MESSAGE}
      </Text>
    </Pane>
  );
}

export default AlertBanner;
